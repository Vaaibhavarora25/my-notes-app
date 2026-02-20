import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) { }

  @Post('signup')
  signup(@Body() body: { email: string; password: string }) {
    return this.client.send({ cmd: 'signup' }, body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.client.send({ cmd: 'login' }, body);
  }
}
