import {
  InjectRepository,
  PrismaRepository,
} from '@spotify-clone-monorepo/model';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  findUnique = this.repository.findUnique;
  findAll = this.repository.findMany;
  count = this.repository.count;

  constructor(
    @InjectRepository('user')
    private readonly repository: PrismaRepository['user']
  ) {}

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput
  ) {
    return this.repository.update({ data, where });
  }

  async findByCredentials(data: { email: string; password: string }) {
    let user = await this.repository.findUnique({
      where: { email: data.email },
    });
    if (!(user && user.password === data.password)) user = null;

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    return this.repository.create({ data });
  }
}
