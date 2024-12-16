import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function uploadOnCloudinary(localFilePath) {
   try {
      if (!localFilePath) {
         console.log("No Local file path recieved in cloudinary")
         return null};
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto",
         folder:"pga/profilePic"
      });
      fs.unlinkSync(localFilePath);
      return response
   }  catch (error) {
    fs.unlinkSync(localFilePath) 
    return null;
}
}

export async function uploadGalleryPhotosOnCloudinary(localFilePath) {
   try {
      if (!localFilePath) return null;
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto",
         folder:"pga/photos"
      });
      fs.unlinkSync(localFilePath);
      return response
   }  catch (error) {
    fs.unlinkSync(localFilePath) 
    return null;
}
}