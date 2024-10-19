import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs, { unlink, unlinkSync } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadonCloudinary = async (fileLocalStorage) => {
  try {
    if (!fileLocalStorage) return null;
    const response = await cloudinary.uploader.upload(fileLocalStorage, {
      resource_type: "auto",
    });
    console.log("File Successfully uploaded on Cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(fileLocalStorage);
    console.log(error);
    return null;
  }
};

export { uploadonCloudinary };
