import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { UserModel } from "../models/user.model.js";
const registerUser = async (req, res) => {
   try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
         return res.status(401).json({
            message: "All fields are required",
            data: null,
            success: false,
         });
      }
      const existedUser = await UserModel.findOne({
         $or: [{ username }, { email }],
      });
      if (existedUser) {
         return res.status(401).json({
            message: "Username or email already taken",
            data: null,
            success: false,
         });
      }
      const profileLocalPath = req.files?.profilPic[0]?.path;
      const profilePicture =await uploadOnCloudinary(profileLocalPath);
      console.log("Profile Picture URL: ", profilePicture);
      if(!profilePicture){
         return res.status(407).json({
            message: "Profile picture is required",
            success: false,
         });
      }
      console.log("profilePicture", profilePicture);
      const user = await UserModel.create({
         username,
         email,
         password,
         profilePicture: profilePicture,
      });
      const createdUser = await UserModel.findById(user._id).select(
         "-password -refreshToken",
      );
      if (!createdUser) {
         return res.status(500).json({
            message: "Something went wrong cannot create user",
            success: false,
         });
      }
      return res.status(201).json({
         message: "User Created",
         createdUser,
         success: true,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         message: "Something went wrong",
         data: null,
         success: false,
         error,
      });
   }
};
export { registerUser };
