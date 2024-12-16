import {FastifyInstance} from 'fastify';
import {getMongoDb} from '../../database/mongodb';
import {pgpool} from "../../database/postgresql";
import {CreateChatPostRequest} from "./types";

export async function createChat(server: FastifyInstance) {
    server.post<CreateChatPostRequest>('/chats/create', {
        onRequest: [server.authenticate],
        schema: {
            tags: ["Chats"],
            summary: "Create a private chat",
            body: {
                type: "object",
                properties: {
                    id: { type: "number" },
                },
                required: ["id"],
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        chatId: { type: "string" },
                    }
                },
                400: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                    }
                }
            }
        }
    }, async (request, reply) => {
        const {id} = request.body;

        if (!id) {
            return reply.status(400).send({error: 'Receiver username is required'});
        }

        try {
            const {userId} = request.user as { userId: number;};

            // Найти пользователя получателя
            const receiver = await pgpool.query('SELECT id FROM users WHERE id = $1', [id]);
            if (receiver.rows.length === 0) {
                return reply.status(404).send({error: 'Receiver not found'});
            }

            // Создаем новый чат между двумя пользователями
            const chatCollection = getMongoDb().collection('chats');
            const existingChat = await chatCollection.findOne({
                participants: {$all: [userId, receiver.rows[0].id]},
            });

            if (existingChat) {
                return reply.status(400).send({error: 'Chat already exists'});
            }

            const chat = await chatCollection.insertOne({
                participants: [userId, receiver.rows[0].id],
                chatType: 'private',
                messages: [],
                createdAt: new Date(),
            });

            reply.send({message: 'Chat created successfully', chatId: chat.insertedId});
        } catch (error) {
            console.error('Error creating chat:', error);
            reply.status(500).send({error: 'Internal server error'});
        }
    });
}
