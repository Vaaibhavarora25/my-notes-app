import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesGatewayModule } from './notes/notes.module';
import { AuthGatewayModule } from './auth/auth.module';

@Module({
  imports: [
    NotesGatewayModule,
    AuthGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
