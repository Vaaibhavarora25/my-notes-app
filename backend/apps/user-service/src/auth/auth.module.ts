import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthRpcController } from './auth-rpc.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme_in_prod_secret_key',
      signOptions: { expiresIn: '7d' },
    }),

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
  controllers: [AuthRpcController],
  providers: [AuthService],
})
export class UserAuthModule { }
