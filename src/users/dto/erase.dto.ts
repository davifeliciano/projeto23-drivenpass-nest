import { IsStrongPassword } from 'class-validator';

export class EraseUserDto {
  @IsStrongPassword({
    minLength: 12,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
