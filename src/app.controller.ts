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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/health')
  getHello(): string {
    return this.appService.getHealth();
  }

  @Post('/erase')
  @HttpCode(HttpStatus.OK)
  eraseUserData(@Body() eraseUserDto: EraseUserDto, @User() user: UserPayload) {
    return this.appService.eraseUserData(user.id, eraseUserDto);
  }
}
