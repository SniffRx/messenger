import {pgpool} from "../database/postgresql";
import bcrypt from "bcrypt";
import {FastifyInstance} from "fastify";
import {LoginRequest} from "./types";

export async function login(server: FastifyInstance) {
    server.post<LoginRequest>('/login',
        {
            schema: {
                summary: 'User login',
                description: 'Authenticate a user and return a JWT token.',
                tags: ['Authentication'],
                body: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {type: 'string', format: 'email', description: 'User email'},
                        password: {type: 'string', description: 'User password'},
                    },
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            token: {type: 'string', description: 'JWT token for authenticated access'},
                        },
                    },
                    401: {
                        type: 'object',
                        properties: {
                            error: {type: 'string', description: 'Invalid credentials'},
                        },
                    },
                    500: {
                        type: 'object',
                        properties: {
                            error: {type: 'string', description: 'Internal server error'},
                        },
                    },
                },
            }
        }, async (request, reply) => {
            const {email, password} = request.body;
            try {
                // Поиск пользователя
                const result = await pgpool.query('SELECT * FROM users WHERE email = $1', [email]);
                if (result.rows.length === 0) {
                    return reply.status(401).send({error: 'Invalid email or password'});
                }

                const user = result.rows[0];

                // Проверка пароля
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    return reply.status(401).send({error: 'Invalid email or password'});
                }

                // Генерация JWT токена
                const token = server.jwt.sign(
                    {userId: user.id, username: user.username}, // Включаем userId и имя пользователя
                    {expiresIn: '1h'} // Срок действия токена — 1 час
                );

                reply.send({token});
            } catch (error) {
                console.error('Error during login:', error);
                reply.status(500).send({error: 'Internal server error'});
            }
        });
}
