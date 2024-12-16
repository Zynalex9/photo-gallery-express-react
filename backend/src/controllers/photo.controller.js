import ApiError from "../utils/apiError.js";
import { PhotoModel } from "../models/photo.model.js";
import { uploadGalleryPhotosOnCloudinary } from "../utils/cloudinary.js";
import { UserModel } from "../models/user.model.js";
export async function UploadPhoto(req, res) {
   try {
      const { title, description, tags } = req.body;
      if (!req.user) {
         throw new ApiError(400, "You need to login to upload");
      }
      if (!title || !description) {
         throw new ApiError(400, "Title or description missing");
      }
      const isPhoto = await PhotoModel.findOne({ title });
      if (isPhoto) {
         throw new ApiError(400, "Title Exist, Please choose another title");
      }
      if (!tags) {
         throw new ApiError(400, "Enter atleast one tag for image");
      }
      const LocalPath = req.files?.uploadedPhoto[0]?.path;
      const response = await uploadGalleryPhotosOnCloudinary(LocalPath);
      const newPhoto =await PhotoModel.create({
         title,
         description,
         tags,
         imageUrl: response.url.toString(),
         cloudinaryId: response.public_id,
         uploadedBy: req.user._id,
      });
      await UserModel.findByIdAndUpdate(req.user._id,
         {
            $push: {
               uploadedPhotos: newPhoto._id
            }
         },

      );
      return res.status(200).json({ message: "Photo Uploaded Successfully", newPhoto });
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
