/* eslint-disable no-console */
import { v2 as cloudinary } from 'cloudinary';
import env from './env';
import AppError from '../errorHelpers/AppError';
import statusCode from 'http-status-codes';

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

export const deleteCloudinaryImage = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from Cloudinary`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      'Cloudinary image delation failed!'
    );
  }
};

export const cloudinaryUpload = cloudinary;
