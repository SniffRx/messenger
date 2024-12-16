import {FastifyInstance} from "fastify";
import {pgpool} from "../../database/postgresql";
import {ShowFriendRequest} from "./types";

export async function showFriends(server: FastifyInstance) {
    server.get<ShowFriendRequest>(
        '/friends',
        {
            onRequest: [server.authenticate],
            schema: {
                summary: 'Get friends list',
                description: 'Retrieve the list of friends for the authenticated user.',
                tags: ['Friends'],
                response: {
                    200: {
                        type: "array",
                        properties: {
                            items: {
                                type: "object",
                                properties: {
                                    id: {type: "integer"},
                                    username: {type: "string"}
                                }
                            },
                        },
                    },
                    500: {type: "object", properties: {error: {type: "string"}}},
                },
            }
        }, async (request, reply) => {
            try {
                const {userId} = request.user as { userId: number };
                // const userId = (request as any).userId; // Достаем userId из токена

                const friends = await pgpool.query(
                    `SELECT friend_id AS id, username
                     FROM friends
                              JOIN users ON friends.friend_id = users.id
                     WHERE user_id = $1
                       AND status = 'accepted'`,
                    [userId]
                );

                reply.send(friends.rows);
            } catch (error) {
                console.error('Error fetching friends:', error);
                reply.status(500).send({error: 'Internal server error'});
            }
        });
}
