import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public.decorator';
import { User, UserPayload } from './users/users.decorator';
import { EraseUserDto } from './users/dto/erase.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/health')
  @ApiOperation({
    summary: 'check if API is alive',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'API is indeed alive',
  })
  getHello(): string {
    return this.appService.getHealth();
  }

  @Post('/erase')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'permanently delete all user data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'wrong password or bearer access token missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'all user data successfully deleted',
  })
  eraseUserData(@Body() eraseUserDto: EraseUserDto, @User() user: UserPayload) {
    return this.appService.eraseUserData(user.id, eraseUserDto);
  }
}
