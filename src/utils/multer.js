import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      file.fieldname +
      Date.now() +
      path.extname(file.originalname).toLowerCase();
    cb(null, uniqueName);
  },
});

const fileFilterForProfile = (req, file, cb) => {
  const mimetype = file.mimetype;
  if (
    mimetype == "image/jpeg" ||
    mimetype == "image/png" ||
    mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("file is not allowed", false));
  }
};

export const uploadPhotoOnly = multer({
  storage,
  fileFilter: fileFilterForProfile,
});
