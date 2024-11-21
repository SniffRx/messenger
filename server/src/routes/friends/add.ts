import { server } from "../../index";
import { pgpool } from "../../database/postgresql";
import {FastifyInstance} from "fastify";

export async function addFriends(server: FastifyInstance) {
// Добавление друга
    server.post<{
        Headers: {
            Authorization: string;
        };
        Body: {
            friendUsername: string;
        };
    }>('/friends/add', {onRequest: [server.authenticate]}, async (request, reply) => {

        // Проверяем, что тело запроса существует
        if (!request.body) {
            return reply.status(400).send({ error: 'Request body is required' });
        }

        const {friendUsername} = request.body;

        if (!friendUsername) {
            return reply.status(400).send({error: 'Friend username is required'});
        }

        try {
            const { userId } = request.user as { userId: number; username: string };
            // const userId = request.authUser?.userId; // Достаем userId из токена

            // Проверяем, существует ли пользователь с таким именем
            const friendResult = await pgpool.query('SELECT id FROM users WHERE username = $1', [friendUsername]);
            if (friendResult.rows.length === 0) {
                return reply.status(404).send({error: 'Friend not found'});
            }

            const friendId = friendResult.rows[0].id;

            //Пользователь не может добавить себя в друзья
            if (userId === friendId) {
                return reply.status(400).send({ error: 'Cannot add yourself as a friend' });
            }

            // Проверяем существование связи
            const existingRequest = await pgpool.query(
                'SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)',
                [userId, friendId]
            );

            if (existingRequest.rows.length > 0) {
                return reply.status(400).send({ error: 'Friendship already exists or is pending' });
            }

            //Добавляем запрос на добавление друга
            await pgpool.query(
                'INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, $3)',
                [userId, friendId, 'pending']
            );

            reply.send({message: 'Friend request sent successfully'});
        } catch (error) {
            console.error('Error adding friend:', error);
            reply.status(500).send({error: 'Internal server error'});
        }
    });
}
