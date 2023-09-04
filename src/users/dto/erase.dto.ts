import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class EraseUserDto {
  @IsStrongPassword({
    minLength: 12,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    example: 'xR&9Lc5YR4#*qQgNcS7p',
    description: 'password prompt before dangerous erase',
  })
  password: string;
}
