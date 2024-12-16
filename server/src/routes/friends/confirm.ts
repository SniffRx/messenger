import { pgpool } from "../../database/postgresql";
import { FastifyInstance } from "fastify";
import {ConfirmFriendRequest} from "./types";

export async function confirmFriend(server: FastifyInstance) {
    server.post<ConfirmFriendRequest>(
        '/friends/confirm',
        {
            onRequest: [server.authenticate],
            schema: {
                summary: 'Confirm friend request',
                description: 'Confirm a pending friend request.',
                tags: ['Friends'],
                body: {
                    type: "object",
                    properties: {
                        friendId: { type: "integer" },
                    },
                    required: ["friendId"],
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                        }
                    },
                    400: { type: "object", properties: { error: { type: "string" } } },
                    500: { type: "object", properties: { error: { type: "string" } } },
                },
            }
        }, async (request, reply) => {

        if (!request.body) {
            return reply.status(400).send({ error: 'Friend ID is required' });
        }

            const { friendId } = request.body;
            const { userId } = request.user as { userId: number };

        if (!friendId || !Number.isInteger(friendId)) {
            return reply.status(400).send({error: 'Invalid friendId. It must be an integer.'});
        }

            try {
                // Проверяем, есть ли запрос на дружбу
                const requestExists = await pgpool.query(
                    `SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2 AND status = 'requested'`,
                    [friendId, userId]
                );

                if (requestExists.rows.length === 0) {
                    return reply.status(400).send({ error: 'No friend request found' });
                }

                // Принять запрос
                await pgpool.query(
                    `UPDATE friends SET status = 'accepted' WHERE user_id = $1 AND friend_id = $2`,
                    [friendId, userId]
                );

                // Также добавляем обратную связь: теперь пользователь также является другом
                await pgpool.query(
                    `INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, 'accepted')`,
                    [userId, friendId]
                );

                reply.send({ message: 'Friend request accepted' });
            } catch (error) {
            console.error('Error confirming friend request:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
