import mongoose from "mongoose";
import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;

if (!MONGODB_URI) {
    throw new Error("Por favor define la variable MONGODB_URI en .env.local");
}

// Cache for Mongoose
const globalCache = global as typeof global & {
    mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
    };
};

globalCache.mongoose = globalCache.mongoose || { conn: null, promise: null };

// Cache for MongoClient
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connects to the database using the MongoDB Node.js driver.
 */
export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    try {
        const client = await new MongoClient(MONGODB_URI as string).connect();
        const db = client.db(MONGODB_DATABASE);

        cachedClient = client;
        cachedDb = db;

        return { client, db };
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("No se pudo conectar a la base de datos.");
    }
}

/**
 * Connects to the database using Mongoose.
 */
export async function connectToMongoose() {
    if (globalCache.mongoose.conn) {
        return globalCache.mongoose.conn;
    }

    if (!globalCache.mongoose.promise) {
        const options = {
            bufferCommands: false,
        };

        globalCache.mongoose.promise = mongoose
            .connect(MONGODB_URI as string, options)
            .then((mongooseInstance) => mongooseInstance.connection);
    }

    try {
        globalCache.mongoose.conn = await globalCache.mongoose.promise;
        return globalCache.mongoose.conn;
    } catch (error) {
        console.error("Error connecting to Mongoose:", error);
        throw new Error("No se pudo conectar a la base de datos usando Mongoose.");
    }
}
