import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CredentialsRepository } from './credentials.repository';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  imports: [PrismaModule],
})
export class CredentialsModule {}
