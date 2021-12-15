import { Provider } from '@nestjs/common';
import * as CloudinaryLib from 'cloudinary';

const library = CloudinaryLib.v2;

const cloudinaryConfig: CloudinaryLib.ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  provisioning_api_key: process.env.CLOUDINARY_API_KEY,
  provisioning_api_secret: process.env.CLOUDINARY_API_SECRET,
};

library.config(cloudinaryConfig);

export const Cloudinary = 'lib:cloudinary';

export const cloudinaryProvider: Provider = {
  provide: Cloudinary,
  useValue: library,
};
