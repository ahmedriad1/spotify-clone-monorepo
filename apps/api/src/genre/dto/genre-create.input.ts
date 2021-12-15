import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class GenreCreateInput {
    @IsNotEmpty()
    @MinLength(1)
    @Field(() => String, { nullable: false })
    name: string;

    @IsNotEmpty()
    @Field(() => String, { nullable: false })
    description: string;
}
