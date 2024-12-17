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
      .json(
         new ApiResponse(
            200,
            searchResult,
            `Result(s) Found: ${searchResult.length}`,
         ),
      );
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
      .json(
         new ApiResponse(
            201,
            searchResult,
            `Result(s) Found: ${searchResult.length}`,
         ),
      );
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
   return res.status(200).json({
      message: `${photo.title} deleted successfully`,
   });
});
export const getAllPhotos = asyncHandler(async (req, res) => {
   const photos = await PhotoModel.find();
   if (!photos.length === 0) {
      throw new ApiError(404, "No Photos found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, photos, `All photos ${photos.length}`));
});
export const getPhoto = asyncHandler(async (req, res) => {
   const { id } = req.params;
   if (!id) {
      throw new ApiError(404, "Please enter photo id");
   }
   const photo = await PhotoModel.findById(id);
   if (!photo) {
      throw new ApiError(404, "No Image found");
   }
   return res
      .status(200)
      .json(new ApiResponse(200, photo, `Returned ${photo.title}`));
});
// 1. Filter Photos by Tags and Title Combined
export const allFilter = asyncHandler(async (req, res) => {
   const { query } = req.query;
   if (!query) {
      throw new ApiError(404, "Please enter a query to find results");
   }
   const results = await PhotoModel.aggregate([
      {
         $match: {
            $or: [
               {
                  title: { $regex: query, $options: "i" },
               },
               {
                  description: { $regex: query, $options: "i" },
               },
               {
                  tags: { $in: [query] },
               },
            ],
         },
      },
   ]);
   if (results.length === 0) {
      return res
         .status(200)
         .json(new ApiResponse(200, [], `No images found for ${query}`));
   }
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            results,
            `${results.length} search results found`,
         ),
      );
});
// 2. Sort Photos by Upload Date and Views
// 3. Paginate Photos
// 4. Top Tags Analytics
// 5. Photo Count Grouped by Users
// 6. Search Photos by Tags and Aggregate User Info
// 7. Get Latest Photos with Uploader Details
// 8. Find Duplicate Photos (Based on Title or Tags)

