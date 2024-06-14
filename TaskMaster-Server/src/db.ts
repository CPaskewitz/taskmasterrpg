import { Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error('MONGO_URI is not defined in the environment variables');
}

const client = new MongoClient(uri);
let db: Db;

export const connectDB = async () => {
    if (!db) {
        try {
            await client.connect();
            db = client.db('taskmaster');
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            process.exit(1);
        }
    }
    return db;
};