import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private SALT_OR_ROUNDS = 10;
  private EXPIRES_IN = '5m';
  private ISSUER = 'DrivenPass';
  private AUDIENCE = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const passwordHash = await bcrypt.hash(password, this.SALT_OR_ROUNDS);
    return await this.usersService.create(email, passwordHash);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);
    const err = new UnauthorizedException('Invalid email or password');

    if (!user) throw err;

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) throw err;

    return await this.createToken(user);
  }

  private async createToken(user: User) {
    const { id, email } = user;

    const token = await this.jwtService.signAsync(
      { id, email },
      {
        expiresIn: this.EXPIRES_IN,
        subject: id.toString(),
        issuer: this.ISSUER,
        audience: this.AUDIENCE,
      },
    );

    return { token };
  }
}
