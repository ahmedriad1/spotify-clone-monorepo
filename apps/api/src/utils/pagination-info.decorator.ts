import { Injectable, PipeTransform } from '@nestjs/common';
import { Args, ArgsType, Field, Int } from '@nestjs/graphql';

export interface IPaginationInfo {
    skip: number;
    take: number;
}

@ArgsType()
class PaginationArgs {
    @Field(() => Int, { name: 'limit', defaultValue: 20 })
    limit = 20;

    @Field(() => Int, { name: 'page', defaultValue: 1 })
    page = 1;
}

@Injectable()
class PaginationPipe implements PipeTransform {
    transform(value: PaginationArgs) {
        return {
            skip: (value.page - 1) * value.limit,
            take: value.limit,
        };
    }
}

export const PaginationInfo = () =>
    Args({ type: () => PaginationArgs }, PaginationPipe);
