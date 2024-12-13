import { FastifyInstance } from "fastify";
import { pgpool } from "../../database/postgresql";
import {ShowFriendRequest} from "./types";

export async function showFriends(server: FastifyInstance) {
    server.get<ShowFriendRequest>('/friends', { onRequest: [server.authenticate] }, async (request, reply) => {
        try {
            const { userId } = request.user as { userId: number; username: string; email: string; };
            // const userId = (request as any).userId; // Достаем userId из токена

            const friends = await pgpool.query(
                `SELECT u.username
                 FROM users u
                 JOIN friends f ON u.id = f.friend_id
                 WHERE f.user_id = $1 AND f.status = 'accepted'`,
                [userId]
            );

            reply.send(friends.rows);
        } catch (error) {
            console.error('Error fetching friends:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
