import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { User, UserPayload } from 'src/users/users.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('credentials')
@ApiTags('credentials')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({
    summary: 'create a credential on the database',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'bearer access token missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'credential created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'there is already an credential with the given title',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'missing body or validation failed against schema',
  })
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: UserPayload,
  ) {
    return this.credentialsService.create(user.id, createCredentialDto);
  }

  @Get()
  @ApiOperation({
    summary: "list all user's credentials",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'bearer access token missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  findAll(@User() user: UserPayload) {
    return this.credentialsService.findAllFromUser(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get a credential with the given id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'bearer access token missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'the credential with the given id does not belongs to the user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid id param format',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
  })
  @ApiParam({
    name: 'id',
    description: 'the id of the credential to retrieve',
    example: '1',
    type: 'integer',
  })
  findOne(@Param('id') id: string, @User() user: UserPayload) {
    return this.credentialsService.findOneFromUser(user.id, +id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'patch a credential with the given id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'bearer access token missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'the credential with the given id does not belongs to the user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'invalid id param format, missing body or validation failed against schema',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'there is already an credential with the given title',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'credential patched successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'the id of the credential to retrieve',
    example: '1',
    type: 'integer',
  })
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
  @ApiOperation({
    summary: 'patch a credential with the given id',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'bearer access token missing or invalid',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'the credential with the given id does not belongs to the user',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid id param format',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'credential deleted successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'the id of the credential to retrieve',
    example: '1',
    type: 'integer',
  })
  remove(@Param('id') id: string, @User() user: UserPayload) {
    return this.credentialsService.removeFromUser(user.id, +id);
  }
}
