import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function uploadOnCloudinary(localFilePath, folder = "pga/photos") {
   try {
      if (!localFilePath) {
         console.log("No Local file path or folder recieved in cloudinary ");
         return null;
      }
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto",
         folder: folder,
      });
      fs.unlinkSync(localFilePath);
      return response;
   } catch (error) {
      fs.unlinkSync(localFilePath);
      return null;
   }
}

export async function deleteFromCloudinary(url) {
   const response = await cloudinary.uploader.destroy(url);
   console.log(response);
   return response;
}
