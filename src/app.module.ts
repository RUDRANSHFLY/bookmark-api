import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { DbService } from './db/db.service';

@Module({
  imports: [BookmarkModule, AuthModule, UserModule,ConfigModule.forRoot({isGlobal : true}), DbModule],
  controllers: [AppController, AuthController,UserController],
  providers: [AppService,AuthService,UserService,DbService],
})
export class AppModule {}
