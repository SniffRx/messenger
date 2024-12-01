import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";

export async function authenticate(server: FastifyInstance) {
    server.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const token = request.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                reply.status(401).send({error: 'Token is required'.red});
                return;
            }

            request.user = server.jwt.verify(token) as { userId: number; username: string }; // Сохраняем декодированный токен
        } catch (err) {
            reply.status(401).send({error: 'Invalid or expired token'.red});
        }
    });
}