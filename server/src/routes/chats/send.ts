import { FastifyInstance } from 'fastify';
import { getMongoDb } from '../../database/mongodb';

export async function sendMessage(server: FastifyInstance) {
    server.post<{
        Headers: {
            Authorization: string;
        };
        Body: {
            chatId: string;
            message: string;
        };
    }>('/chats/send-message', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { chatId, message } = request.body;

        if (!chatId || !message) {
            return reply.status(400).send({ error: 'Chat ID and message are required' });
        }

        try {
            const { userId } = request.user as { userId: number; username: string };

            // Находим чат
            const chatCollection = getMongoDb().collection('chats');
            const chat = await chatCollection.findOne({ _id: chatId });

            if (!chat || !chat.participants.includes(userId)) {
                return reply.status(404).send({ error: 'Chat not found' });
            }

            // Добавляем сообщение в чат
            await chatCollection.updateOne(
                { _id: chat._id },
                {
                    $push: {
                        messages: {
                            senderId: userId,
                            content: message,
                            messageType: 'text',
                            createdAt: new Date(),
                        },
                    },
                }
            );

            reply.send({ message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error sending message:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
