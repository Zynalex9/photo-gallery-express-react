import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import Redis from "ioredis";
dotenv.config({
   path: "./.env",
});
connectDB();
export const redis = new Redis({
   host: "redis-16372.c83.us-east-1-2.ec2.redns.redis-cloud.com",
   username: "default",
   password: "pcklzlwlU8wFuvIgMaajf80CgaxpfzBU",
   port: 16372,
});
redis.on("error", () => {
   console.log("failed to connect to redis");
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
