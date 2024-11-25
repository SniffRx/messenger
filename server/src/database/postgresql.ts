import { Pool } from 'pg';

export const pgpool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'messenger',
    password: '192837456serg',
    port: 5432, // Порт по умолчанию
    max: 13,
});

// Логирование успешного подключения
pgpool.connect()
    .then(client => {
        console.log('Connected to PostgreSQL'.green);
        client.release(); // Освобождение соединения обратно в пул
    })
    .catch(err => console.error(`Connection error ${err.stack}`.red));