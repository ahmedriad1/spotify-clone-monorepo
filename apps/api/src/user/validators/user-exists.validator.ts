import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UserService } from '../user.service';

@ValidatorConstraint({ name: 'user', async: true })
@Injectable()
export class UserExistsValidator implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string) {
    const result = await this.userService.findUnique({
      where: { email },
      select: { id: true },
    });
    return !result;
  }

  defaultMessage() {
    return 'User with $property $value already exists';
  }
}
