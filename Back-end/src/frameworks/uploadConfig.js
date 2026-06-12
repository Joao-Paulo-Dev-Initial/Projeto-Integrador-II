const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinaryConfig");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "tanabox",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

module.exports = upload;