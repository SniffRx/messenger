import { FastifyInstance } from 'fastify';
import { getMongoDb } from '../../database/mongodb';
import {GetChatsRequest} from "./types";

export async function getChats(server: FastifyInstance) {
    server.get<GetChatsRequest>('/chats',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ["Chats"], // Этот тег будет отображаться в Swagger
                summary: "Get list of chats for a user", // Краткое описание
                description: "Fetch all the chats that the authenticated user is part of", // Полное описание
                response: {
                    200: {
                        description: "List of chats the user is part of",
                        type: "object",
                        properties: {
                            chats: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string" },
                                        participants: {
                                            type: "array",
                                            items: { type: "number" }
                                        },
                                        chatType: { type: "string" },
                                        createdAt: { type: "string", format: "date-time" },
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        description: "Internal server error",
                        type: "object",
                        properties: {
                            error: { type: "string" }
                        }
                    }
                },
                security: [
                    {
                        apiKey: []  // Указываем, что для доступа требуется API-ключ
                    }
                ]
            }
        }, async (request, reply) => {
        try {
            const { userId } = request.user as { userId: number; };

            const chatCollection = getMongoDb().collection('chats');
            const chats = await chatCollection.find({ participants: userId }).toArray();

            reply.send({ chats });
        } catch (error) {
            console.error('Error fetching chats:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
