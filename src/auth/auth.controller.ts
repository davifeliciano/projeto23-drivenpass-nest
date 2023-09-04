import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@Public()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'register a new user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'user created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'there is already an user registered with the given email',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'missing body or validation failed against schema',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'retrieve an access token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful login' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'authorization failed for the given email or password',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'missing body or validation failed against schema',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
