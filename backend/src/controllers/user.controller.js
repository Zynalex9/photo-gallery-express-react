import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { UserModel } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
async function genereteToken(userId) {
   try {
      console.log("Received userId:", userId); // Debug log

      const user = await UserModel.findById(userId);
      if (!user) {
         throw new ApiError(404, "User not found");
      }
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
   } catch (error) {
      console.log("tokenerror",error)
      throw new ApiError(
         500,
         "Something went wrong while generating referesh and access token",
      );
   }
}

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
      console.log(profileLocalPath)
      const profilePicture = await uploadOnCloudinary(profileLocalPath,"pga/profilePic");
      if (!profilePicture) {
         return res.status(407).json({
            message: "Profile picture is required",
            success: false,
         });
      }
      const user = await UserModel.create({
         username,
         email,
         password,
         profilePicture: profilePicture.url,
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
const loginUser = asyncHandler(async (req, res) => {
   const { email, username, password } = req.body;
   if (!email && !username) {
      throw new ApiError(401, "Please enter email or username");
   }
   const user = await UserModel.findOne({ $or: [{ username }, { email }] });
   if (!user) {
      throw new ApiError(401, "User not found");
   }
   const isValidPassword = user.isPasswordCorrect(password);
   if (!isValidPassword) {
      throw new ApiError(401, "Incorrect password");
   }
   console.log("User found:", user);
   const { accessToken, refreshToken } = await genereteToken(user._id);
   const options = {
      secure: true,
      httpOnly: true,
   };
   const loggedInUser = await UserModel.findById(user._id).select(
      "-password -refreshToken",
   );
   res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(201, loggedInUser, "User Logged in"));
});
export { registerUser, loginUser };
