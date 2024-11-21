import { FastifyInstance } from 'fastify';
import { getMongoDb } from '../../database/mongodb';
import { pgpool } from "../../database/postgresql";

export async function createChat(server: FastifyInstance) {
    server.post<{
        Headers: {
            Authorization: string;
        };
        Body: {
            receiverUsername: string;
        };
    }>('/chats/create', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { receiverUsername } = request.body;

        if (!receiverUsername) {
            return reply.status(400).send({ error: 'Receiver username is required' });
        }

        try {
            const { userId } = request.user as { userId: number; username: string };

            // Найти пользователя получателя
            const receiver = await pgpool.query('SELECT id FROM users WHERE username = $1', [receiverUsername]);
            if (receiver.rows.length === 0) {
                return reply.status(404).send({ error: 'Receiver not found' });
            }

            // Создаем новый чат между двумя пользователями
            const chatCollection = getMongoDb().collection('chats');
            const existingChat = await chatCollection.findOne({
                participants: { $all: [userId, receiver.rows[0].id] },
            });

            if (existingChat) {
                return reply.status(400).send({ error: 'Chat already exists' });
            }

            const chat = await chatCollection.insertOne({
                participants: [userId, receiver.rows[0].id],
                chatType: 'private',
                messages: [],
                createdAt: new Date(),
            });

            reply.send({ message: 'Chat created successfully', chatId: chat.insertedId });
        } catch (error) {
            console.error('Error creating chat:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
