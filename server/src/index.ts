import Fastify, {FastifyReply, FastifyRequest} from "fastify"
import dotenv from 'dotenv'
import jwt from "@fastify/jwt";
import fastifyFormbody from '@fastify/formbody'
import {registerRoutes} from "./routes";
import "colors.ts";

dotenv.config()

export const server = Fastify({
    trustProxy: true,
    logger: {
        level: "warn"
    }
})

server.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'your-secret-key'
});

server.register(fastifyFormbody);


// Расширяем сервер через `declare`
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

// Добавляем декоратор `authenticate`
server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            reply.status(401).send({ error: 'Token is required'.red });
            return;
        }
        request.user = server.jwt.verify(token) as { userId: number; username: string }; // Сохраняем декодированный токен
    } catch (err) {
        reply.status(401).send({ error: 'Invalid or expired token'.red });
    }
});

// Регистрируем маршруты
registerRoutes(server);


server.listen({port:Number(process.env.PORT ?? 3000)}, (err, address) => {
    if (err) {
        console.error(`${err}`.red);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`.green);
});