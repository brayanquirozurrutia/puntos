import { Db } from 'mongodb';

export const up = async (db: Db) => {
    const collections = ['users', 'companies', 'transactions', 'points'];

    for (const collectionName of collections) {
        const exists = await db.listCollections({ name: collectionName }).hasNext();
        if (!exists) {
            await db.createCollection(collectionName);
            console.log(`Collection '${collectionName}' created.`);
        } else {
            console.log(`Collection '${collectionName}' already exists.`);
        }
    }
};

export const down = async (db: Db) => {
    const collections = ['users', 'companies', 'transactions', 'points'];

    for (const collectionName of collections) {
        const exists = await db.listCollections({ name: collectionName }).hasNext();
        if (exists) {
            await db.collection(collectionName).drop();
            console.log(`Collection '${collectionName}' dropped.`);
        }
    }
};
