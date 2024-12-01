import { MongoClient } from 'mongodb';
import "colors.ts"

const mongoUrl = 'mongodb://0.0.0.0:27017'; // URL для подключения к MongoDB
const dbName = 'chatapp'; // Название базы данных

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
