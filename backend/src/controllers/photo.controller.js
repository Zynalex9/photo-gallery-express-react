import ApiError from "../utils/apiError.js";
import { PhotoModel } from "../models/photo.model.js";
import {
   deleteFromCloudinary,
   uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
export async function UploadPhoto(req, res) {
   try {
      const { title, description, tags } = req.body;
      if (!req.user) {
         throw new ApiError(400, "You need to login to upload");
      }
      if (!title || !description) {
         throw new ApiError(400, "Title or description missing");
      }

      if (!tags) {
         throw new ApiError(400, "Enter atleast one tag for image");
      }
      const LocalPath = req.files?.uploadedPhoto[0]?.path;
      const response = await uploadOnCloudinary(LocalPath, "pga/photos");
      const newPhoto = await PhotoModel.create({
         title,
         description,
         tags,
         imageUrl: response.url.toString(),
         cloudinaryId: response.public_id,
         uploadedBy: req.user._id,
      });
      await UserModel.findByIdAndUpdate(req.user._id, {
         $push: {
            uploadedPhotos: newPhoto._id,
         },
      });
      return res
         .status(200)
         .json({ message: "Photo Uploaded Successfully", newPhoto });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         message: "Something went wrong",
         data: null,
         success: false,
         error,
      });
   }
}
export const searchByTitle = asyncHandler(async (req, res) => {
   const { title } = req.query;
   if (!title) {
      throw new ApiError(407, "Please enter a title to search");
   }
   const searchResult = await PhotoModel.find({
      title: { $regex: title, $options: "i" },
   });
   if (searchResult.length === 0) {
      return res.status(404).json(new ApiResponse(404, [], "No Items found"));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, searchResult, "Result found"));
});
export const searchByTags = asyncHandler(async (req, res) => {
   const { tags } = req.query;
   if (!tags) {
      throw new ApiError(407, "Please enter a tag to search");
   }
   const searchTags = tags.split(",");
   console.log(searchTags);
   const searchResult = await PhotoModel.find({
      tags: { $in: searchTags },
   });
   if (searchResult.length === 0) {
      return res
         .status(404)
         .json({ message: "No photos found with the provided tags" });
   }
   return res
      .status(201)
      .json(new ApiResponse(201, searchResult, "Result Found"));
});
export const deletePhoto = asyncHandler(async (req, res) => {
   const { id } = req.body;
   if (!id) {
      throw new ApiError(400, "Photo ID is required");
   }
   const photo = await PhotoModel.findById(id);
   if (!photo) {
      throw new ApiError(404, "Photo not found");
   }
   if (photo.cloudinaryId) {
      const response = await deleteFromCloudinary(photo.cloudinaryId);
      if (response.result !== "ok") {
         throw new ApiError(500, "Error deleting image from Cloudinary");
      }
   }
   const delResponse = await PhotoModel.findByIdAndDelete(id);
   if (delResponse) {
      await UserModel.findByIdAndUpdate(req.user._id, {
         $pull: {
            uploadedPhotos: delResponse._id,
         },
      });
   }
   return res
      .status(200)
      .json({
         message:`${photo.title} deleted successfully`
      });
});
