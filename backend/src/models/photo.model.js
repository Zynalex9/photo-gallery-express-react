import mongoose from "mongoose";

const PhotoSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         trim: true,
      },
      tags: {
         type: [String], 
         default: [],
      },
      imageUrl: {
         type: String,
         required: true,
      },
      cloudinaryId: {
         type: String,
         required: true,
      },
      uploadedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true },
);

export const PhotoModel = mongoose.model("Photo", PhotoSchema);
