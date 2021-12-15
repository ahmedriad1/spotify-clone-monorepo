import { InputType, PartialType } from '@nestjs/graphql';
import { GenreCreateInput } from './genre-create.input';

@InputType()
export class GenreUpdateInput extends PartialType(GenreCreateInput) {}
