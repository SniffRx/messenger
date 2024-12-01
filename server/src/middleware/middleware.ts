import {FastifyInstance} from "fastify";
import {authenticate} from "./authenticate";

export async function registerMiddleWare(server: FastifyInstance) {
    await authenticate(server)
}