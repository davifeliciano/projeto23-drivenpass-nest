import { createDecipheriv, createCipheriv } from 'crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CredentialsService {
  private readonly CIPHER_ALGO = 'aes-256-cbc';
  private readonly CIPHER_IV = Buffer.from(process.env.CIPHER_IV, 'base64');
  private readonly CIPHER_SECRET = Buffer.from(
    process.env.CIPHER_SECRET,
    'base64',
  );

  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  private cipherPassword(password: string | undefined | null) {
    if (!password) {
      return null;
    }

    const cipher = createCipheriv(
      this.CIPHER_ALGO,
      this.CIPHER_SECRET,
      this.CIPHER_IV,
    );

    let passwordCipher = '';
    passwordCipher = cipher.update(password, 'utf-8', 'hex');
    passwordCipher += cipher.final('hex');

    return passwordCipher;
  }

  private decipherPassword(passwordCipher: string | undefined | null) {
    if (!passwordCipher) {
      return null;
    }

    const decipher = createDecipheriv(
      this.CIPHER_ALGO,
      this.CIPHER_SECRET,
      this.CIPHER_IV,
    );

    let password = '';
    password = decipher.update(passwordCipher, 'hex', 'utf-8');
    password += decipher.final('utf-8');

    return password;
  }

  async create(userId: number, createCredentialDto: CreateCredentialDto) {
    const { password } = createCredentialDto;

    try {
      return await this.credentialsRepository.create(userId, {
        ...createCredentialDto,
        password: this.cipherPassword(password),
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'User already has a credential with this title',
        );
      }

      throw err;
    }
  }

  async findAllFromUser(userId: number) {
    const credentials =
      await this.credentialsRepository.findAllFromUser(userId);

    return credentials.map((credential) => ({
      ...credential,
      password: this.decipherPassword(credential.password),
    }));
  }

  async findOneFromUser(userId: number, id: number) {
    const credential = await this.credentialsRepository.findOne(id);

    if (!credential) {
      throw new NotFoundException('Credential not found');
    }

    if (credential.userId !== userId) {
      throw new ForbiddenException();
    }

    return {
      ...credential,
      password: this.decipherPassword(credential.password),
    };
  }

  async updateFromUser(
    userId: number,
    id: number,
    updateCredentialDto: UpdateCredentialDto,
  ) {
    const { password } = updateCredentialDto;

    try {
      return await this.credentialsRepository.updateFromUser(userId, id, {
        ...updateCredentialDto,
        password: this.cipherPassword(password),
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        const credential = await this.credentialsRepository.findOne(id);
        throw credential === null
          ? new NotFoundException('Credential not found')
          : new ForbiddenException();
      }

      throw err;
    }
  }

  async removeFromUser(userId: number, id: number) {
    try {
      return await this.credentialsRepository.removeFromUser(userId, id);
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        const credential = await this.credentialsRepository.findOne(id);
        throw credential === null
          ? new NotFoundException('Credential not found')
          : new ForbiddenException();
      }

      throw err;
    }
  }
}
