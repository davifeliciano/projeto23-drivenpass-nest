import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, password: string) {
    return await this.prisma.user.create({
      data: { email, password },
      select: { id: true, email: true },
    });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
      select: { id: true, email: true },
    });
  }
}
