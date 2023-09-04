import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EraseUserDto } from './users/dto/erase.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}

  getHealth(): string {
    return "I'm OK!";
  }

  async eraseUserData(userId: number, eraseDto: EraseUserDto) {
    const user = await this.usersService.findById(userId);
    const { password } = eraseDto;
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      throw new UnauthorizedException();
    }

    return await this.usersService.remove(userId);
  }
}
