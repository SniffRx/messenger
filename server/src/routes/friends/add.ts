import {pgpool} from "../../database/postgresql";
import {FastifyInstance} from "fastify";
import {AddFriendRequest} from "./types";

export async function addFriends(server: FastifyInstance) {
// Добавление друга
    server.post<AddFriendRequest>(
        '/friends/add',
        {
            onRequest: [server.authenticate],
            schema: {
                summary: 'Send a friend request',
                description: 'Send a friend request to another user.',
                tags: ['Friends'],
                body: {
                    type: "object",
                    properties: {
                        friendId: {type: "integer"},
                    },
                    required: ["friendId"],
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            message: {type: "string"},
                        }
                    },
                    400: {type: "object", properties: {error: {type: "string"}}},
                    500: {type: "object", properties: {error: {type: "string"}}},
                },
            }
        }, async (request, reply) => {

            // Проверяем, что тело запроса существует
            if (!request.body) {
                return reply.status(400).send({error: 'Request body is required'});
            }

            const {friendId} = request.body;
            const {userId} = request.user as { userId: number };

            if (userId === friendId) {
                return reply.status(400).send({error: 'You cannot send a request to yourself'});
            }

            try {
                // Проверяем, не является ли запрос уже отправленным или принят.
                const existingRequest = await pgpool.query(
                    `SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
                    [userId, friendId]
                );

                if (existingRequest.rows.length > 0) {
                    return reply.status(400).send({ error: 'Friend request already exists or already friends' });
                }

                // Создаем новый запрос
                await pgpool.query(
                    `INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'requested')`,
                    [userId, friendId]
                );

                reply.send({ message: 'Friend request sent' });
            } catch (error) {
                console.error('Error adding friend:', error);
                reply.status(500).send({error: 'Internal server error'});
            }
        });
}
