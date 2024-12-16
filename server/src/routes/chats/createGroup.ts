import {FastifyInstance} from 'fastify';
import {getMongoDb} from '../../database/mongodb';
import {pgpool} from "../../database/postgresql";
import {CreateGroupChatRequest} from "./types";

export async function createGroupChat(server: FastifyInstance) {
    server.post<CreateGroupChatRequest>(
        '/chats/create-group',
        {
            onRequest: [server.authenticate],
            schema: {
                tags: ["Chats"],
                summary: "Create a group chat",
                body: {
                    type: "object",
                    properties: {
                        participants: { type: "array", items: { type: "string" } },
                        chatName: { type: "string" },
                    },
                    required: ["participants", "chatName"],
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            chatId: { type: "string" },
                        },
                    },
                    400: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                        },
                    },
                },
            },
        }, async (request, reply) => {
        const {participants, chatName} = request.body;

        if (!participants || participants.length < 2 || !chatName) {
            return reply.status(400).send({error: 'At least two participants and a chat name are required'});
        }

        try {
            const {userId} = request.user as { userId: number; username: string; email: string; };

            // Находим участников чата
            const users = await pgpool.query('SELECT id, username FROM users WHERE username = ANY($1)', [
                participants,
            ]);
            if (users.rows.length !== participants.length) {
                return reply.status(404).send({error: 'One or more participants not found'});
            }

            // Добавляем текущего пользователя в список участников
            const allParticipants = [userId, ...users.rows.map((user) => user.id)];

            // Создаем групповой чат
            const chatCollection = getMongoDb().collection('chats');
            const chat = await chatCollection.insertOne({
                participants: allParticipants,
                chatType: 'group',
                chatName,
                messages: [],
                createdAt: new Date(),
            });

            reply.send({message: 'Group chat created successfully', chatId: chat.insertedId});
        } catch (error) {
            console.error('Error creating group chat:', error);
            reply.status(500).send({error: 'Internal server error'});
        }
    });
}
