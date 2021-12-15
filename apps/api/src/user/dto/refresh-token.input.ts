import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RefreshTokenInput {
    @IsNotEmpty()
    @Field(() => String, { nullable: false })
    refreshToken: string;
}
