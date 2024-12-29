import { Router } from "express";
import {
   getUser,
   loginUser,
   logOut,
   registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
   allFilter,
   deletePhoto,
   findDuplicatePhotos,
   getAllPhotos,
   getPhoto,
   PaginatePhotos,
   photoCountByUsers,
   photosByUser,
   searchByTags,
   searchByTitle,
   sortByDate,
   tagsAndUser,
   topTags,
   UploadPhoto,
} from "../controllers/photo.controller.js";

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
userRouter.route("/logout").post(verifyJWT, logOut);
userRouter.route("/getuser").get(verifyJWT, getUser);

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
photoRouter.route("/searchbytitle").get(searchByTitle);
photoRouter.route("/searchbytags").get(searchByTags);
photoRouter.route("/allFilter").get(allFilter);
photoRouter.route("/sortbydate").get(sortByDate);
photoRouter.route("/paginatephotos").get(PaginatePhotos);
photoRouter.route("/toptags").get(topTags);
photoRouter.route("/photocountbyuser").get(photoCountByUsers);
photoRouter.route("/tagsandusers").get(tagsAndUser);
photoRouter.route("/duplicatephotos").get(findDuplicatePhotos);
photoRouter.route("/delete-photo").delete(verifyJWT, deletePhoto);
photoRouter.route("/all-photos").get(getAllPhotos);
photoRouter.route("/single-photo/:id").get(getPhoto);
photoRouter.route("/photos-by-user").get(verifyJWT, photosByUser);
export { userRouter, photoRouter };
