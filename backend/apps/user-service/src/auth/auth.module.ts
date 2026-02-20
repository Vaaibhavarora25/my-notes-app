import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'secret123',
      signOptions: { expiresIn: '7d' },
    }),

    ClientsModule.register([
      {
        name: 'NOTES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTES_SERVICE_HOST || '127.0.0.1',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
