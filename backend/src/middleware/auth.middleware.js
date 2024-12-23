import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";

export async function verifyJWT(req, res, next) {
  try {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new ApiResponse(401, {}, "Unauthorized: No token provided"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decodedToken?.id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json(new ApiResponse(401, {}, error?.message || "Invalid Access Token"));
  }
}
