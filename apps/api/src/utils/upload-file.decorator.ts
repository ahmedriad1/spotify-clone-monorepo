import { Injectable, PipeTransform } from '@nestjs/common';
import { Args, ArgsOptions } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Injectable()
class FileTypePipe implements PipeTransform {
    constructor(private readonly options: IFileUploadOptions) {}

    transform(value: FileUpload) {
        if (!value) return value;

        if (!this.options.allowedTypes.includes(value.mimetype))
            throw new UserInputError(
                `Invalid file type. "${
                    this.options.name
                }" must be: ${this.options.allowedTypes.join(', ')}`,
            );

        return value;
    }
}

interface IFileUploadOptions extends Omit<ArgsOptions, 'type'> {
    allowedTypes: string[];
}

export const UploadFile = (options: IFileUploadOptions) =>
    Args({ ...options, type: () => GraphQLUpload }, new FileTypePipe(options));
