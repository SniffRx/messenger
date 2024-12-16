import {FastifyInstance} from "fastify";
import {pgpool} from "../../database/postgresql";
import {showFriendRequests} from "./types";

export async function showFriendRequests(server: FastifyInstance) {
    server.get<showFriendRequests>(
        '/friends/requests',
        {
            onRequest: [server.authenticate],
            schema: {
                summary: 'Get all pending friend requests',
                description: 'Retrieve the list of pending friend requests for the authenticated user.',
                tags: ['Friends'],
                response: {
                    200: {
                        type: "object",
                        properties: {
                            requested: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        friend_id: {
                                            type: "integer",
                                            description: "The ID of the user to whom the friend request was sent."
                                        },
                                        username: {
                                            type: "string",
                                            description: "The username of the user to whom the friend request was sent."
                                        }
                                    }
                                }
                            },
                            receiver: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        user_id: {
                                            type: "integer",
                                            description: "The ID of the user who sent the friend request."
                                        },
                                        username: {
                                            type: "string",
                                            description: "The username of the user who sent the friend request."
                                        }
                                    }
                                }
                            }
                        }
                    },
                    500: {
                        type: "object",
                        properties: {
                            error: {type: "string", description: "Description of the error."}
                        }
                    }
                }
            }
        }, async (request, reply) => {
            try {
                const {userId} = request.user as { userId: number };
                // const userId = (request as any).userId; // Достаем userId из токена

                const sentRequests = await pgpool.query(
                    `SELECT friend_id AS friend_id
                     FROM friends
                     WHERE user_id = $1
                       AND status = 'requested'`,
                    [userId]
                );

                const receivedRequests = await pgpool.query(
                    `SELECT user_id AS user_id
                     FROM friends
                     WHERE friend_id = $1
                       AND status = 'requested'`,
                    [userId]
                );

                reply.send({
                    requested: sentRequests.rows,
                    receiver: receivedRequests.rows
                });
            } catch (error) {
                console.error('Error fetching friends:', error);
                reply.status(500).send({error: 'Internal server error'});
            }
        }
    )
    ;
}
