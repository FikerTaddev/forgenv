import dotenv from "dotenv";
import fs from "fs";

export function loadEnv(files: string | string[] = [".env"]) {
    const fileList = Array.isArray(files) ? files : [files];

    const merged: Record<string, string> = {};

    for (const file of fileList) {
        if (!fs.existsSync(file)) continue;

        const result = dotenv.config({ path: file });

        if (result.parsed) {
            Object.assign(merged, result.parsed);
        }
    }

    return merged;
}