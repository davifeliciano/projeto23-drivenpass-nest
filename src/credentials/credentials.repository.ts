import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Credential } from '@prisma/client';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: Omit<Credential, 'id' | 'userId'>) {
    return await this.prisma.credential.create({
      data: { ...data, userId },
      select: { id: true, title: true, username: true, url: true },
    });
  }

  async findAllFromUser(userId: number) {
    return await this.prisma.credential.findMany({ where: { userId } });
  }

  async findOne(id: number) {
    return await this.prisma.credential.findUnique({ where: { id } });
  }

  async updateFromUser(
    userId: number,
    id: number,
    data: Partial<Omit<Credential, 'id' | 'userId'>>,
  ) {
    return await this.prisma.credential.update({
      data,
      where: { id, userId },
      select: { id: true, title: true, username: true, url: true },
    });
  }

  async removeFromUser(userId: number, id: number) {
    return await this.prisma.credential.delete({
      where: { id },
      select: { id: true, title: true, username: true, url: true },
    });
  }
}
