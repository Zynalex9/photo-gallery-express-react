import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
const UserSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
      },
      profilePicture: {
         type: String,
         // required: true,
      },
      refreshToken: {
         type: String,
      },
   },
   { timestamps: true },
);

UserSchema.pre("save", async function(next){
   if (!this.isModified("password")) return next();
   this.password = await bcryptjs.hash(this.password, 10)
   next()
});

UserSchema.methods.isPasswordCorrect = async function (password) {
   return await bcryptjs.compare(password, this.password);
};
UserSchema.methods.generateAccessToken = () => {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         username: this.username,
         fullName: this.fullName,
      },
      process.env.JWT_SECRET_KEY,
      {
         expiresIn: process.env.ACCESS_EXPIRY,
      },
   );
};
UserSchema.methods.generateRefreshToken = () => {
   return jwt.sign(
      {
         _id: this._id,
      },
      process.env.JWT_SECRET_KEY,
      {
         expiresIn: process.env.REFRESH_EXPIRY,
      },
   );
};
export const UserModel = mongoose.model("User", UserSchema);
