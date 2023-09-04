import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(email: string, password: string) {
    try {
      return await this.usersRepository.create(email, password);
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('Account already exists');
      }
    }
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
  }

  async remove(id: number) {
    return await this.usersRepository.remove(id);
  }
}
