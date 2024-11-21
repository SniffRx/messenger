import { FastifyInstance } from 'fastify';
import { getMongoDb } from '../../database/mongodb';

export async function getChats(server: FastifyInstance) {
    server.get<{
        Headers: {
            Authorization: string;
        };
    }>('/chats', { onRequest: [server.authenticate] }, async (request, reply) => {
        try {
            const { userId } = request.user as { userId: number; username: string };

            const chatCollection = getMongoDb().collection('chats');
            const chats = await chatCollection.find({ participants: userId }).toArray();

            reply.send({ chats });
        } catch (error) {
            console.error('Error fetching chats:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
