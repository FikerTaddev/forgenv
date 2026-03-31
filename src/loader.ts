import dotenv from "dotenv"

export function loadEnv() {
     dotenv.config()
      return process.env
}