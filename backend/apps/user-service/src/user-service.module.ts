import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UserAuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, UserAuthModule],
  controllers: [],
  providers: [],
})
export class UserServiceModule { }
