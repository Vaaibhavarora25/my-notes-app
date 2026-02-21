import {
  Body,
  ConflictException,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { catchError, firstValueFrom } from 'rxjs';

@ApiTags('Auth')
@Controller('auth')
export class AuthHttpController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  private mapRpcError(error: any): never {
    const statusCode = Number(
      error?.statusCode ?? error?.error?.statusCode ?? error?.response?.statusCode,
    );
    const message =
      error?.message ?? error?.error?.message ?? error?.response?.message ?? 'Internal server error';

    if (statusCode === 409) {
      throw new ConflictException(message);
    }
    if (statusCode === 401) {
      throw new UnauthorizedException(message);
    }
    throw new InternalServerErrorException(message);
  }

  @ApiOperation({ summary: 'Create a user account' })
  @ApiBody({ type: AuthRequestDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @Post('signup')
  async signup(@Body() body: AuthRequestDto) {
    return firstValueFrom(
      this.client.send({ cmd: 'signup' }, body).pipe(
        catchError((error) => {
          this.mapRpcError(error);
        }),
      ),
    );
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: AuthRequestDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() body: AuthRequestDto) {
    return firstValueFrom(
      this.client.send({ cmd: 'login' }, body).pipe(
        catchError((error) => {
          this.mapRpcError(error);
        }),
      ),
    );
  }
}
