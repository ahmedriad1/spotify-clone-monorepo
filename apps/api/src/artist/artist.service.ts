import {
  InjectRepository,
  PrismaRepository,
  ArtistWhereUniqueInput,
} from '@spotify-clone-monorepo/model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { FileUpload } from 'graphql-upload';

import { CreateArtistInput, UpdateArtistInput } from './dto';

@Injectable()
export class ArtistService {
  findOne = this.repo.findUnique;
  findAll = this.repo.findMany;
  count = this.repo.count;

  constructor(
    @InjectRepository('artist')
    protected readonly repo: PrismaRepository['artist'],
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create({
    data,
    user,
    select,
    image,
  }: {
    data: CreateArtistInput;
    user: UserModel;
    select: any;
    image?: FileUpload;
  }) {
    if (await this.findOne({ where: { userId: user.id } }))
      throw new BadRequestException('Artist already exsits');

    let imageId;

    if (image)
      imageId = (await this.cloudinaryService.uploadImage(image)).public_id;

    return this.repo.create({
      select,
      data: {
        ...data,
        imageId,
        user: { connect: { id: user.id } },
      },
    });
  }

  async update({
    where,
    data,
    select,
    image,
  }: {
    where: ArtistWhereUniqueInput;
    data: UpdateArtistInput;
    select: any;
    image?: FileUpload;
  }) {
    const artist = await this.findOne({ where, rejectOnNotFound: true });

    let newImageId;
    if (image) {
      newImageId = (await this.cloudinaryService.uploadImage(image)).public_id;
      if (artist.imageId) this.cloudinaryService.deleteImages([artist.imageId]);
    }

    return this.repo.update({
      where,
      data: {
        ...data,
        user: data?.user?.id ? { connect: data.user } : {},
        imageId: newImageId,
      },
      select,
    });
  }

  async remove({
    where,
    select,
  }: {
    where: ArtistWhereUniqueInput;
    select: any;
  }) {
    const artist = await this.findOne({ where, rejectOnNotFound: true });
    if (artist.imageId) this.cloudinaryService.deleteImages([artist.imageId]);
    return this.repo.delete({ where, select });
  }
}
