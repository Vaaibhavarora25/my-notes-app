import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject('QUEUE_SERVICE') private queueClient: ClientProxy,
  ) {}

  async signup(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new RpcException({
        statusCode: 409,
        message: 'User already exists',
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, password: hash });

    this.queueClient
      .emit('notes.welcome.create', { userId: user.id })
      .subscribe({ error: () => undefined });

    return this.createToken(user.id);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    return this.createToken(user.id);
  }

  createToken(userId: string) {
    return {
      access_token: this.jwtService.sign({ sub: userId }),
    };
  }
}
