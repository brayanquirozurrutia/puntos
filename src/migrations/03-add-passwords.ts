import { Db } from 'mongodb';
import bcrypt from 'bcrypt';

export const up = async (db: Db) => {
    console.log("Adding passwords to users...");

    const users = await db.collection("users").find({}).toArray();

    for (const user of users) {
        const passwordHash = await bcrypt.hash("defaultPassword123", 10);
        await db.collection("users").updateOne(
            { _id: user._id },
            { $set: { password: passwordHash } }
        );
    }

    console.log("Passwords added.");
};

export const down = async (db: Db) => {
    console.log("Removing passwords from users...");

    await db.collection("users").updateMany({}, { $unset: { password: "" } });

    console.log("Passwords removed.");
};
