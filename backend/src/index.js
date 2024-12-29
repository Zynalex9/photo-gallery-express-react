import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import Redis from "ioredis";
dotenv.config({
   path: "./.env",
});
connectDB();
export const redis = new Redis({
   host:process.env.REDIS_HOST,
   username: process.env.REDIS_USERNAME,
   password: process.env.REDIS_PASSWORD,
   port: process.env.REDIS_PORT,
});
redis.on("error", (e) => {
   console.log("failed to connect to redis",e);
});
redis.on("connect", () => {
   console.log("Connected to redis");
});
redis.on("connecting", () => {
   console.log("Connecting to redis");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log("Server is running on port", PORT);
});
