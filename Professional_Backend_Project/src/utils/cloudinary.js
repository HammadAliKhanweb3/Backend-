import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs, { unlink, unlinkSync } from "fs";

cloudinary.config({
  cloud_name: dl2uqf25z,
  api_key: 267356223564734,
  api_secret: Q7fdk7oCyRvIVl2bRVbFw6Vg75I,
});
const fileUpload = async (fileLocalStorage) => {
  try {
    if (!fileLocalStorage) return null;
    const response = await cloudinary.uploader.upload(fileLocalStorage, {
      resource_type: auto,
    });
    console.log("File Successfully uploaded on Cloudinary", response.url);
    return response;
  } catch (error) {
    unlinkSync(fileLocalStorage);
    console.log(error);
    return null;
  }
};

export { fileUpload };
