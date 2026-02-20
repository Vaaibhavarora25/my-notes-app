import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('NOTES_SERVICE') private notesClient: ClientProxy,
  ) { }

  async signup(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new Error('User exists');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password: hash });

    // Fire-and-forget welcome note — don't let notes-service failures block signup
    firstValueFrom(
      this.notesClient.send(
        { cmd: 'create' },
        {
          dto: {
            title: 'Welcome! 👋',
            content: `Hi, I am called through the message queuing service. My user ID is ${user.id}`,
          },
          user: { id: user.id },
        },
      ),
    ).catch(() => {
      // Ignore errors — welcome note is a nice-to-have
    });

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
