import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  create(createUserDto: RegisterDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: RegisterDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
