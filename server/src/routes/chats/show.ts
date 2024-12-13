import { FastifyInstance } from 'fastify';
import { getMongoDb } from '../../database/mongodb';
import {GetChatsRequest} from "./types";

export async function getChats(server: FastifyInstance) {
    server.get<GetChatsRequest>('/chats', { onRequest: [server.authenticate] }, async (request, reply) => {
        try {
            const { userId } = request.user as { userId: number; username: string; email: string; };

            const chatCollection = getMongoDb().collection('chats');
            const chats = await chatCollection.find({ participants: userId }).toArray();

            reply.send({ chats });
        } catch (error) {
            console.error('Error fetching chats:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
