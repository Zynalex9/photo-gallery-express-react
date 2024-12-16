import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { UploadPhoto } from "../controllers/photo.controller.js";

const userRouter = Router();

userRouter.route("/register").post(
   upload.fields([
      {
         name: "profilPic",
         maxCount: 1,
      },
   ]),
   registerUser,
);
userRouter.route("/login").post(loginUser);

const photoRouter = Router();

photoRouter.route("/upload-photo").post(
   verifyJWT,
   upload.fields([
      {
         name: "uploadedPhoto",
         maxCount: 1,
      },
   ]),
   UploadPhoto,
);
export { userRouter, photoRouter };
