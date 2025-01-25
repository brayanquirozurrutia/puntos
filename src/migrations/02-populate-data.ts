import { Db } from 'mongodb';

export const up = async (db: Db) => {
    console.log("Populating data...");

    const users = [
        { name: "Alice", email: "alice@example.com", createdAt: new Date() },
        { name: "Bob", email: "bob@example.com", createdAt: new Date() },
        { name: "Charlie", email: "charlie@example.com", createdAt: new Date() },
    ];

    const companies = [
        { name: "TechCorp", description: "Technology company", createdAt: new Date() },
        { name: "HealthPlus", description: "Healthcare company", createdAt: new Date() },
    ];

    const insertedUsers = await db.collection("users").insertMany(users);
    const insertedCompanies = await db.collection("companies").insertMany(companies);

    const transactions = [
        {
            userId: insertedUsers.insertedIds[0],
            companyId: insertedCompanies.insertedIds[0],
            amount: 100,
            pointsEarned: 10,
            createdAt: new Date(),
        },
        {
            userId: insertedUsers.insertedIds[1],
            companyId: insertedCompanies.insertedIds[1],
            amount: 200,
            pointsEarned: 20,
            createdAt: new Date(),
        },
    ];

    const points = [
        {
            userId: insertedUsers.insertedIds[0],
            companyId: insertedCompanies.insertedIds[0],
            points: 50,
        },
        {
            userId: insertedUsers.insertedIds[1],
            companyId: insertedCompanies.insertedIds[1],
            points: 100,
        },
    ];

    await db.collection("transactions").insertMany(transactions);
    await db.collection("points").insertMany(points);

    console.log("Data population completed.");
};

export const down = async (db: Db) => {
    console.log("Reverting populated data...");

    await db.collection("transactions").deleteMany({});
    await db.collection("points").deleteMany({});
    await db.collection("companies").deleteMany({});
    await db.collection("users").deleteMany({});

    console.log("Reverted populated data.");
};
