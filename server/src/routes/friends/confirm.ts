import { pgpool } from "../../database/postgresql";
import { FastifyInstance } from "fastify";
import {ConfirmFriendRequest} from "./types";

export async function confirmFriend(server: FastifyInstance) {
    server.post<ConfirmFriendRequest>('/friends/confirm', { onRequest: [server.authenticate] }, async (request, reply) => {

        if (!request.body) {
            return reply.status(400).send({ error: 'Friend ID is required' });
        }

        const { friendId } = request.body;

        if (!friendId || !Number.isInteger(friendId)) {
            return reply.status(400).send({error: 'Invalid friendId. It must be an integer.'});
        }

        try {
            // Получаем текущего пользователя из токена
            const { userId } = request.user as { userId: number; username: string; email: string; };

            // Проверяем, существует ли заявка на дружбу
            const pendingRequest = await pgpool.query(
                `SELECT * FROM friends 
                 WHERE user_id = $1 AND friend_id = $2 AND status = $3`,
                [friendId, userId, 'pending']
            );

            if (pendingRequest.rows.length === 0) {
                return reply.status(404).send({ error: 'No pending friend request found' });
            }

            // Обновляем статус на "accepted"
            await pgpool.query(
                `UPDATE friends 
                 SET status = $1 
                 WHERE user_id = $2 AND friend_id = $3 AND status = $4`,
                ['accepted', friendId, userId, 'pending']
            );

            reply.send({ message: 'Friend request confirmed successfully' });
        } catch (error) {
            console.error('Error confirming friend request:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
