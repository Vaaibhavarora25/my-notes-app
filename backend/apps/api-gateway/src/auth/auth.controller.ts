import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject('QUEUE_SERVICE') private client: ClientProxy) {}

  @ApiOperation({ summary: 'Create a user account' })
  @ApiBody({ type: AuthRequestDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('signup')
  signup(@Body() body: AuthRequestDto) {
    return this.client.send({ cmd: 'auth.signup' }, body);
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: AuthRequestDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @Post('login')
  login(@Body() body: AuthRequestDto) {
    return this.client.send({ cmd: 'auth.login' }, body);
  }
}
