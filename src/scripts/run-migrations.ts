import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import { readdir } from "fs/promises";
import { connectToDatabase } from "@/lib/mongodb";

async function runMigrations() {
    try {
        const { db } = await connectToDatabase();
        console.log("Conectado a MongoDB");

        const migrationsPath = path.join(process.cwd(), "src/migrations");
        const migrationFiles = await readdir(migrationsPath);

        for (const file of migrationFiles) {
            if (file.endsWith(".ts") || file.endsWith(".js")) {
                const migrationModule = await import(path.join(migrationsPath, file));
                const { up } = migrationModule;
                console.log(`Ejecutando migración: ${file}`);
                await up(db);
                console.log(`Migración '${file}' completada.`);
            }
        }

        console.log("Todas las migraciones se ejecutaron correctamente.");
        process.exit(0);
    } catch (error) {
        console.error("Error ejecutando migraciones:", error);
        process.exit(1);
    }
}

runMigrations().then(r => r);
