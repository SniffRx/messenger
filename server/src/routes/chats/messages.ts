import { FastifyInstance } from 'fastify';
import { getMongoDb } from '../../database/mongodb';
import { Collection, ObjectId } from 'mongodb';

export async function getChatMessages(server: FastifyInstance) {
    // Эндпоинт для загрузки сообщений с пагинацией
    server.get<{ Params: { chatId: string }; Querystring: { limit?: number; offset?: number } }>(
        '/chats/:chatId/messages',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ['Chats'],
                summary: 'Get paginated messages from a chat',
                description: 'Retrieve messages from a specific chat using pagination.',
                params: {
                    type: 'object',
                    properties: {
                        chatId: { type: 'string', description: 'Chat ID', example: '63a9b47b4f1a4c2d8f1e6e93' }
                    },
                    required: ['chatId']
                },
                querystring: {
                    type: 'object',
                    properties: {
                        limit: { type: 'integer', default: 20, description: 'Number of messages to retrieve' },
                        offset: { type: 'integer', default: 0, description: 'Number of messages to skip' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            messages: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        senderId: { type: 'number' },
                                        content: { type: 'string' },
                                        messageType: { type: 'string', enum: ['text', 'image', 'video'] },
                                        createdAt: { type: 'string', format: 'date-time' }
                                    }
                                }
                            }
                        }
                    },
                    403: { type: 'object', properties: { error: { type: 'string' } } },
                    404: { type: 'object', properties: { error: { type: 'string' } } },
                    500: { type: 'object', properties: { error: { type: 'string' } } }
                }
            }
        },
        async (request, reply) => {
            const { chatId } = request.params;
            const { limit = 20, offset = 0 } = request.query;

            try {
                const { userId } = request.user as { userId: number };

                const chatCollection: Collection = getMongoDb().collection('chats');
                const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });

                if (!chat) {
                    return reply.status(404).send({ error: 'Chat not found' });
                }

                if (!chat.participants.includes(userId)) {
                    return reply.status(403).send({ error: 'You are not a participant in this chat' });
                }

                // Пагинация сообщений
                const messages = chat.messages
                    .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
                    .slice(offset, offset + limit);

                reply.send({ messages });
            } catch (error) {
                console.error('Error fetching chat messages:', error);
                reply.status(500).send({ error: 'Internal server error' });
            }
        }
    );

    // WebSocket для получения сообщений в реальном времени
    server.route({
        method: 'GET',
        url: '/chats/:chatId/ws',
        websocket: true,
        handler: async (connection, request) => {
            const { chatId } = request.params;

            try {
                const { userId } = request.user as { userId: number };

                const chatCollection: Collection = getMongoDb().collection('chats');
                const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });

                if (!chat || !chat.participants.includes(userId)) {
                    connection.socket.close();
                    return;
                }

                // Подписка клиента на чат
                connection.socket.on('message', async (message) => {
                    const parsedMessage = JSON.parse(message.toString());
                    if (parsedMessage.type === 'sendMessage') {
                        const { content } = parsedMessage;

                        const newMessage = {
                            senderId: userId,
                            content,
                            messageType: 'text',
                            createdAt: new Date(),
                        };

                        // Добавляем сообщение в базу данных
                        await chatCollection.updateOne(
                            { _id: chat._id },
                            { $push: { messages: newMessage } }
                        );

                        // Отправляем сообщение всем подписанным клиентам
                        connection.socket.send(
                            JSON.stringify({
                                type: 'newMessage',
                                message: newMessage
                            })
                        );
                    }
                });
            } catch (error) {
                console.error('WebSocket error:', error);
                connection.socket.close();
            }
        }
    });
}
