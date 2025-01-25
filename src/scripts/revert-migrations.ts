import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { readdir } from "fs/promises";
import { connectToDatabase } from "@/lib/mongodb";

async function revertMigrations() {
    try {
        const { db } = await connectToDatabase();
        console.log("Conectado a MongoDB");

        const migrationsPath = path.join(process.cwd(), "src/migrations");
        const migrationFiles = await readdir(migrationsPath);

        for (const file of migrationFiles.reverse()) {
            if (file.endsWith(".ts") || file.endsWith(".js")) {
                const { down } = await import(path.join(migrationsPath, file));
                console.log(`Revirtiendo migración: ${file}`);
                await down(db);
                console.log(`Migración '${file}' revertida.`);
            }
        }

        console.log("Todas las migraciones se revirtieron correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("Error revirtiendo migraciones:", error);
        process.exit(1);
    }
}

revertMigrations().then(r => r);
