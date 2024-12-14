import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

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

export { userRouter };
