import {
  InjectRepository,
  PrismaRepository,
} from '@spotify-clone-monorepo/model';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class GenreService {
  findAll = this.repository.findMany;
  findUnique = this.repository.findUnique;
  update = this.repository.update;
  count = this.repository.count;

  constructor(
    @InjectRepository('genre')
    private readonly repository: PrismaRepository['genre']
  ) {}

  async createGenre(data: Prisma.GenreCreateInput) {
    return this.repository.create({ data });
  }
}
