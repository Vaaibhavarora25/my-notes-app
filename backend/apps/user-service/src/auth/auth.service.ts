import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signup(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new Error('User exists');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password: hash });

    return this.createToken(user.id);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();

    return this.createToken(user.id);
  }

  createToken(userId: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId }),
    };
  }
}
