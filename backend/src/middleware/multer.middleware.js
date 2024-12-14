import multer from "multer";
const storge = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./public/temp");
      console.log("from multer file",file)
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   },
});
export const upload = multer({
   storge,
});
