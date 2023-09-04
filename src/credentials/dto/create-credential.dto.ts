import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Google',
    description: 'an unique identifier for the credential',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    examples: ['johndoe', 'johndoe@gmail.com'],
    description: 'the username of the credential',
  })
  username: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '$MnbyPsK&zWxB$u72Ejx',
    description: 'the password of the credential',
  })
  password: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @ApiProperty({
    example: 'https://google.com',
    description: 'the url of the service of the credential',
  })
  url: string;
}
