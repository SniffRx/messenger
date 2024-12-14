import {Pool} from 'pg';
import dotenv from "dotenv";
dotenv.config(); // Загружает .env

export const pgpool = new Pool({
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_HOST,
    database: process.env.POSTGRESQL_DATABASE,
    password: process.env.POSTGRESQL_PASSWORD,
    port: Number(process.env.POSTGRESQL_PORT), // Порт по умолчанию
    max: 13,
});

// Логирование успешного подключения
pgpool.connect().then(client => {
    console.log('Connected to PostgreSQL'.green);
    client.release(); // Освобождение соединения обратно в пул
}).catch(err => console.error(`Connection error ${err.stack}`.red));