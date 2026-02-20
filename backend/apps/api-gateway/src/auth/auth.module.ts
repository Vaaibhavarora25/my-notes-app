import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUEUE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.QUEUE_SERVICE_HOST || '127.0.0.1',
          port: Number(process.env.QUEUE_SERVICE_PORT || 3004),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule { }
