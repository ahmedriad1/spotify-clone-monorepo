import { Inject, Injectable } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload';
import { Cloudinary } from './cloudinary.provider';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(Cloudinary) private readonly cloudinary) {}

  async uploadImage(file: FileUpload): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const cld_upload_stream = this.cloudinary.uploader.upload_stream(
        { format: 'jpg' },
        (error: any, result: any) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      file.createReadStream().pipe(cld_upload_stream);
    });
  }

  deleteImages(ids: string[]) {
    this.cloudinary.api.delete_resources(ids);
  }

  async uploadTrack(trackFile: FileUpload): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const cld_upload_stream = this.cloudinary.uploader.upload_stream(
        { resource_type: 'video', format: 'ogg', audio_codec: 'opus' },
        (error: any, result: any) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      trackFile.createReadStream().pipe(cld_upload_stream);
    });
  }

  deleteTracks(ids: string[]) {
    this.cloudinary.api.delete_resources(ids, {
      resource_type: 'video',
    });
  }
}
