import dotenv from "dotenv";
import fs from "fs";

export function loadEnv(files: string[] = [".env"]) {
    for (const file of files) {
        if (fs.existsSync(file)) {
            dotenv.config({ path: file });
        }
    }
    return process.env;
}