import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthRpcController {
  constructor(private authService: AuthService) { }

  @MessagePattern({ cmd: 'signup' })
  signup(@Payload() payload: { email: string; password: string }) {
    return this.authService.signup(payload.email, payload.password);
  }

  @MessagePattern({ cmd: 'login' })
  login(@Payload() payload: { email: string; password: string }) {
    return this.authService.login(payload.email, payload.password);
  }
}
