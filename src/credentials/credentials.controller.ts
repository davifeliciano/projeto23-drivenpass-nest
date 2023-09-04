import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { User, UserPayload } from 'src/users/users.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('credentials')
@UseGuards(AuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: UserPayload,
  ) {
    return this.credentialsService.create(user.id, createCredentialDto);
  }

  @Get()
  findAll(@User() user: UserPayload) {
    return this.credentialsService.findAllFromUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserPayload) {
    return this.credentialsService.findOneFromUser(user.id, +id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
    @User() user: UserPayload,
  ) {
    return this.credentialsService.updateFromUser(
      user.id,
      +id,
      updateCredentialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: UserPayload) {
    return this.credentialsService.removeFromUser(user.id, +id);
  }
}
