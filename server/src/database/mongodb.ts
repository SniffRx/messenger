import { MongoClient } from 'mongodb'
import "colors.ts"
import dotenv from 'dotenv'
dotenv.config(); // Загружает .env

const mongoUrl = ''+process.env.MONGODB_HOST; // URL для подключения к MongoDB
const dbName = ''+process.env.MONGODB_DATABASE; // Название базы данных

export const mongoClient = new MongoClient(mongoUrl);

export const connectToMongoDB = async () => {
    try {
        await mongoClient.connect();
        console.log('MongoDB connected'.green);
    } catch (error) {
        console.error(`MongoDB connection error: ${error}`.red);
    }
};

export const getMongoDb = () => mongoClient.db(dbName);
