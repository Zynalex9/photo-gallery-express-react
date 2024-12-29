import ApiError from "../utils/apiError.js";
import { PhotoModel } from "../models/photo.model.js";
import {
   deleteFromCloudinary,
   uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { redis } from "../index.js";
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
   const cachedKey = "allPhotos";
   const cachedPhotos = await redis.get(cachedKey);
   if (cachedPhotos) {
      console.log("cache hit");
      return res
         .status(200)
         .json(
            new ApiResponse(200, JSON.parse(cachedPhotos), "From Redis Cache"),
         );
   }
   const photos = await PhotoModel.find();
   if (!photos.length === 0) {
      throw new ApiError(404, "No Photos found");
   }
   console.log("cache miss");

   await redis.set("allPhotos", JSON.stringify(photos), "EX", 3600);
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
// 2. Sort Photos by Upload Date
export const sortByDate = asyncHandler(async (req, res) => {
   //-1 for descending , 1 ascending
   const { sortingOrder } = req.body;
   const results = await PhotoModel.aggregate([
      {
         $sort: {
            createdAt: sortingOrder || -1,
         },
      },
   ]);
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            results,
            `Photos are filtered in ${sortingOrder == -1 ? "Descending" : "Ascending"} order`,
         ),
      );
});
// 3. Paginate Photos
export const PaginatePhotos = asyncHandler(async (req, res) => {
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 5;
   const skip = (page - 1) * limit;
   const cachedKey = `photos:page:${page}:limit:${limit}`;
   const cachedPhotos = await redis.get(cachedKey);
   if (cachedPhotos) {
      console.log("cache hit");
      return res
         .status(200)
         .json(
            new ApiResponse(
               200,
               JSON.parse(cachedPhotos),
               "Photos returned from a cache",
            ),
         );
   }
   const results = await PhotoModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
   ]);
   const totalDocuments = await PhotoModel.countDocuments();
   const totalPages = Math.ceil(totalDocuments / limit);
   await redis.set(cachedKey, JSON.stringify({
      totalDocuments,
      totalPages,
      results,
      limit,
   }), "EX", 3600);   console.log("cache miss")
   return res.status(200).json(
      new ApiResponse(
         200,
         {
            totalDocuments,
            totalPages,
            results,
            limit,
         },
         "Photos fetched successfully with pagination",
      ),
   );
});
// 4. Top Tags Analytics
export const topTags = asyncHandler(async (req, res) => {
   const results = await PhotoModel.aggregate([
      {
         $unwind: {
            path: "$tags",
         },
      },
      {
         $group: {
            _id: "$tags",
            count: {
               $sum: 1,
            },
         },
      },
      {
         $sort: {
            count: -1,
         },
      },
      {
         $limit: 5,
      },
   ]);
   return res.status(200).json(new ApiResponse(200, results, "Top tags"));
});
// 5. Photo Count Grouped by Users
export const photoCountByUsers = asyncHandler(async (req, res) => {
   const results = await PhotoModel.aggregate([
      {
         $group: {
            _id: "$uploadedBy",
            count: {
               $sum: 1,
            },
         },
      },
      {
         $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "_id",
            as: "userDetails",
         },
      },
      {
         $unwind: {
            path: "$userDetails",
         },
      },
      {
         $sort: {
            count: -1,
         },
      },
   ]);
   return res
      .status(200)
      .json(new ApiResponse(200, results, "Photo Count Grouped by Users"));
});
// 6. Search Photos by Tags and Aggregate User Info
export const tagsAndUser = asyncHandler(async (req, res) => {
   const { tags } = req.query;
   if (!tags) {
      throw new ApiError(407, "Please enter a tag to search");
   }
   const results = await PhotoModel.aggregate([
      {
         $match: {
            tags: { $regex: tags, $options: "i" },
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "uploadedBy",
            foreignField: "_id",
            as: "UploadedBy",
         },
      },
      {
         $project: {
            title: 1,
            tags: 1,
            imageUrl: 1,
            UploadedBy: {
               username: 1,
               profilePicture: 1,
            },
         },
      },
   ]);
   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            results,
            "Photos by Tags and Aggregate User Info",
         ),
      );
});
// 7. Find Duplicate Photos (Based on Title or Tags)
export const findDuplicatePhotos = asyncHandler(async (req, res) => {
   const results = await PhotoModel.aggregate([
      {
         $group: {
            _id: {
               title: "$title",
               tags: "$tags",
            },
            count: {
               $sum: 1,
            },
            photo: {
               $push: "$$ROOT",
            },
         },
      },
      {
         $match: { count: { $gt: 1 } },
      },
   ]);
   return res
      .status(200)
      .json(new ApiResponse(200, results, "Duplicate photos"));
});
export const photosByUser = asyncHandler(async (req, res) => {
   const userID = req.user._id || null;
   if (!userID) {
      return res
         .status(401)
         .json(
            new ApiResponse(
               401,
               {},
               "You are not logged in to get photos for a user",
            ),
         );
   }
   const photos = await PhotoModel.find({ uploadedBy: userID });
   if (!photos) {
      return res
         .status(404)
         .json(new ApiResponse(404, {}, "No Images uploaded by user"));
   }
   return res
      .status(200)
      .json(new ApiResponse(200, photos, "images available"));
});
