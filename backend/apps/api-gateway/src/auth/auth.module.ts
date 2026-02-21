import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthHttpController } from './auth-http.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || '127.0.0.1',
          port: Number(process.env.USER_SERVICE_PORT || 3003),
        },
      },
    ]),
  ],
  controllers: [AuthHttpController],
  providers: [JwtStrategy],
})
export class AuthGatewayModule { }
