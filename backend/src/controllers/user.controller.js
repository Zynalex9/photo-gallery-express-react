import { UserModel } from "../models/user.model";
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
      const user = await UserModel.create({
         username,
         email,
         password,
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
      return res
         .status(201)
         .json({ message: "User Created", createdUser, success: true });
   } catch (error) {
      return res.status(500).json({
         message: "Something went wrong",
         data: null,
         success: false,
      });
   }
};
export { registerUser };
