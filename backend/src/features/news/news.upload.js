const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return callback(new Error("Format gambar harus JPG, PNG, atau WEBP."));
    }

    callback(null, true);
  },
});

function handleImageUpload(req, res, next) {
  imageUpload.single("image")(req, res, (error) => {
    if (error) {
      const status =
        error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE"
          ? 413
          : 400;

      return res.status(status).json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Ukuran gambar maksimal 5 MB."
            : error.message || "Gagal memproses gambar.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Pilih gambar terlebih dahulu.",
      });
    }

    next();
  });
}

async function uploadImageToCloudinary(buffer) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const error = new Error("Konfigurasi Cloudinary belum lengkap di backend.");

    error.status = 503;
    throw error;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hmif/news",
        resource_type: "image",
      },
      (error, uploadedImage) => {
        if (error) {
          return reject(error);
        }

        resolve(uploadedImage);
      },
    );

    stream.end(buffer);
  });
}

module.exports = {
  handleImageUpload,
  uploadImageToCloudinary,
};
