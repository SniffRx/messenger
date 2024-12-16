import { pgpool } from "../../database/postgresql";
import {FastifyInstance} from "fastify";
import {RemoveFriendRequest} from "./types";

export async function removeFriends(server: FastifyInstance)
{
    // Удаление друга
    server.delete<RemoveFriendRequest>(
        '/friends/remove',
        {
            onRequest: [server.authenticate],
            schema: {
                summary: 'Remove a friend',
                description: 'Remove an existing friend from the user\'s friend list.',
                tags: ['Friends'],
                body: {
                    type: 'object',
                    required: ['friendUsername'],
                    properties: {
                        friendUsername: { type: 'string', description: 'The username of the friend to remove' },
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                        },
                    },
                    400: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                    404: {
                        type: 'object',
                        properties: {
                            error: { type: 'string' },
                        },
                    },
                },
            }
        }, async (request, reply) => {
        // Проверяем, что тело запроса существует
        if (!request.body) {
            return reply.status(400).send({ error: 'Request body is required' });
        }

        const { friendUsername } = request.body;

        if (!friendUsername) {
            return reply.status(400).send({ error: 'Friend username is required' });
        }

        try {
            const { userId } = request.user as { userId: number; username: string; email: string; };
            // const userId = (request as any).userId; // Достаем userId из токена

            // Проверяем, существует ли пользователь с таким именем
            const friendResult = await pgpool.query('SELECT id FROM users WHERE username = $1', [friendUsername]);
            if (friendResult.rows.length === 0) {
                return reply.status(404).send({ error: 'Friend not found' });
            }

            const friendId = friendResult.rows[0].id;

            //Проверяем существование связи
            const friendship = await pgpool.query(
                'SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
                [userId, friendId]
            );

            if (friendship.rows.length === 0) {
                return reply.status(404).send({ error: 'No friendship found' });
            }

            //Удаляем запись о дружбе
            await pgpool.query(
                'DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
                [userId, friendId]
            );

            reply.send({ message: 'Friend removed successfully' });
        } catch (error) {
            console.error('Error removing friend:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}