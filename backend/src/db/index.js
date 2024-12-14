import mongoose from "mongoose";
async function connectDB() {
   try {
      const connection = await mongoose.connect(process.env.MONGODB_URI);
   } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
   }
}
export default connectDB