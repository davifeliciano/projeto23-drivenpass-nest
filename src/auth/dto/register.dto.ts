import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({
    example: 'johndoe@gmail.com',
    description: 'email address to use as a credential',
  })
  email: string;

  @IsStrongPassword({
    minLength: 12,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    example: 'xR&9Lc5YR4#*qQgNcS7p',
    description:
      'an strong password. make sure to write it down in a safe place.',
  })
  password: string;
}
