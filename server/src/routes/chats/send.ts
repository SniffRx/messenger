import { FastifyInstance } from 'fastify';
import { getMongoDb } from '../../database/mongodb';
import {Collection, ObjectId} from "mongodb";
import {ChatDocument, SendMessageRequest} from "./types";

export async function sendMessage(server: FastifyInstance) {
    server.post<SendMessageRequest>('/chats/send-message', { onRequest: [server.authenticate] }, async (request, reply) => {
        const { chatId, message } = request.body;

        if (!chatId || !message) {
            return reply.status(400).send({ error: 'Chat ID and message are required' });
        }

        try {
            const { userId } = request.user as { userId: number; username: string };

            // Находим чат
            // Получаем коллекцию чатов с типизацией
            const chatCollection: Collection<ChatDocument> = getMongoDb().collection<ChatDocument>('chats');
            // Находим чат по идентификатору
            const chat = await chatCollection.findOne({ _id: new ObjectId(chatId) });

            if (!chat || !chat.participants.includes(userId)) {
                return reply.status(404).send({ error: 'Chat not found' });
            }

            if (!chat.participants.includes(userId)) {
                return reply.status(403).send({ error: 'You are not a participant in this chat' });
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
