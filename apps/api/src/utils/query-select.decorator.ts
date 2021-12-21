import { Injectable, PipeTransform } from '@nestjs/common';
import { Info } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { GraphQLResolveInfo } from 'graphql';

type DefaultFieldsType = {
  [key: string]:
    | {
        [key: string]: boolean;
      }
    | ((select: unknown) => {
        [key: string]: boolean;
      });
};

@Injectable()
class PrismaSelectPipe implements PipeTransform {
  constructor(private readonly defaultFields: DefaultFieldsType) {}

  transform(value: GraphQLResolveInfo) {
    return new PrismaSelect(value, { defaultFields: this.defaultFields }).value
      .select;
  }
}

export const QuerySelect = (data?: DefaultFieldsType) =>
  Info(new PrismaSelectPipe(data));
