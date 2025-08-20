// upload.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: "dkq9lkfkr",
  api_key: 568332969428178,
  api_secret: "Oaj50qXAeArtlUFA9aQCB6fcPLo",
});

// Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tour_packages",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });
module.exports = upload;
