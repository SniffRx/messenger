import { MongoClient } from 'mongodb';

const mongoUrl = 'mongodb://localhost:27017'; // URL для подключения к MongoDB
const dbName = 'chatapp'; // Название базы данных

export const mongoClient = new MongoClient(mongoUrl);
export const connectToMongoDB = async () => {
    try {
        await mongoClient.connect();
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export const getMongoDb = () => mongoClient.db(dbName);
