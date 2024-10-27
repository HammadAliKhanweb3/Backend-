import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs, { unlink, unlinkSync } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadonCloudinary = async (fileLocalpath) => {
  try {
    if (!fileLocalpath) return null;
    const response = await cloudinary.uploader.upload(fileLocalpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(fileLocalpath);
    return response;
  } catch (error) {
    fs.unlinkSync(fileLocalpath);
    console.log(error);
    return null;
  }
};

const deleteOnCloudinary = async (fileLocalpath) => {
  try {
    if (!fileLocalpath) return null;
    const response = await cloudinary.uploader.destroy(fileLocalpath, {
      resource_type: "auto",
    });
    console.log("File Deleted Successfully ", response.url);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export { uploadonCloudinary, deleteOnCloudinary };
