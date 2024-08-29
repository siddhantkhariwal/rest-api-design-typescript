import mongoose from "mongoose";

// Define the type for the environment variables
interface ProcessEnv {
    DB_NAME: string;
    MONGO_URI: string;
}

// Type assertion for process.env
const env = process.env as unknown as ProcessEnv;

async function connectMongo(): Promise<void> {
    try {
        const db = env.DB_NAME;
        await mongoose.connect(`${env.MONGO_URI}${db}`);
        console.log('Connected to MongoDB.');
    } catch (error) {
        console.error('Error connecting to MongoDB.');
        console.error(error);
    }
}

connectMongo();
