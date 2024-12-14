import {pgpool} from "../database/postgresql";
import bcrypt from "bcrypt";
import {FastifyInstance} from "fastify";
import {LoginRequest} from "./types";

export async function login(server: FastifyInstance){
    server.post<LoginRequest>('/login', async (request, reply) => {
        const { email, password } = request.body;
        try {
            // Поиск пользователя
            const result = await pgpool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return reply.status(401).send({ error: 'Invalid username or password' });
            }

            const user = result.rows[0];

            // Проверка пароля
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return reply.status(401).send({ error: 'Invalid username or password' });
            }

            // Генерация JWT токена
            const token = server.jwt.sign(
                { userId: user.id, username: user.username }, // Включаем userId и имя пользователя
                { expiresIn: '1h' } // Срок действия токена — 1 час
            );

            reply.send({ token });
        } catch (error) {
            console.error('Error during login:', error);
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}
