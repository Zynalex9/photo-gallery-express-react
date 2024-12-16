import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/connection", (res, req) => {
   connectDB();
   req.send("hello");
});

import { photoRouter, userRouter } from "./routes/index.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/photo", photoRouter);

export { app };
