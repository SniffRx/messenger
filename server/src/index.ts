import Fastify from "fastify"
import dotenv from 'dotenv'
import jwt from "@fastify/jwt";
import fastifyFormbody from '@fastify/formbody'
import {registerRoutes} from "./routes";
import "colors.ts";
import {registerMiddleWare} from "./middleware/middleware";
import cors from '@fastify/cors';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

dotenv.config()

export const server = Fastify({
    trustProxy: true,
    logger: {
        level: "warn"
    }
})

server.register(cors, {
    origin: 'http://localhost:5173', // Укажите адрес вашего клиента
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешённые методы
    allowedHeaders: ['Content-Type', 'Authorization'], // Разрешённые заголовки
});

server.register(jwt, {
    secret: process.env.JWT_SECRET ?? 'your-secret-key'
});

// Регистрация Swagger
server.register(fastifySwagger, {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Test swagger',
            description: 'Testing the Fastify swagger API',
            version: '0.1.0'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header'
                }
            }
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        }
    }
});

// Подключение интерфейса Swagger UI
server.register(fastifySwaggerUi, {
    routePrefix: "/docs", // Swagger UI будет доступен по пути /docs
    staticCSP: true,
    transformSpecification: (swaggerObject, request, reply) => swaggerObject,
    transformSpecificationClone: true,
});

server.register(fastifyFormbody);

// Регистрируем маршруты
registerRoutes(server);
registerMiddleWare(server);

server.listen({
    host: process.env.ADDRESS ?? "0.0.0.0",
    port: 3000
}, (err, address) => {
    if (err) {
        console.error(`${err}`.red);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`.green);
});