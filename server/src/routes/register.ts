import {pgpool} from "../database/postgresql";
import bcrypt from "bcrypt";
import {FastifyInstance} from "fastify";
import {RegisterRequest} from "./types";

export async function register(server: FastifyInstance){
    server.post<RegisterRequest>('/register',
        {
            schema: {
                summary: 'User registration',
                description: 'Register a new user with email, username, and password.',
                tags: ['Authentication'],
                body: {
                    type: 'object',
                    required: ['email', 'username', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', description: 'User email' },
                        username: { type: 'string', description: 'User username' },
                        password: { type: 'string', description: 'User password' },
                    },
                },
                response: {
                    201: {
                        type: 'object',
                        properties: {
                            message: { type: 'string', description: 'Success message' },
                        },
                    },
                    400: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Error details' },
                        },
                    },
                    500: {
                        type: 'object',
                        properties: {
                            error: { type: 'string', description: 'Internal server error' },
                        },
                    },
                },
            },
        }, async (request, reply) => {
        console.log('Received Request Body:', request.body);

        // Проверим, что тело запроса не пустое
        if (!request.body) {
            console.error('Request body is empty');
            return reply.status(400).send({ error: 'Request body is empty' });
        }

        const { email, username, password } = request.body;

        if (!email || !username || !password) {
            console.error('Email, Username or password is missing');
            return reply.status(400).send({ error: 'Email, Username and password are required' });
        }

        // Проверка на существование пользователя
        const userCheck = await pgpool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return reply.status(400).send({ error: 'User already exists' });
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставка пользователя в БД
        await pgpool.query('INSERT INTO users (email, username, password) VALUES ($1, $2, $3)', [email, username, hashedPassword]);

        reply.status(201).send({ message: 'User registered successfully' });
    });
}
