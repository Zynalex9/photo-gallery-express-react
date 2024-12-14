import {app} from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
dotenv.config({
  path: "./.env"
})
connectDB()
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
