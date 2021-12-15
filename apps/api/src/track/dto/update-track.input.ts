import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTrackInput } from './create-track.input';

@InputType()
export class UpdateTrackInput extends PartialType(CreateTrackInput) {}
