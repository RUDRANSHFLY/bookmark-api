import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports : [DbModule,JwtModule.register({
        global : true,
        signOptions : {
            expiresIn : "2d"
        }
    }),],
    controllers : [AuthController],
    providers : [AuthService]
})
export class AuthModule {

}
