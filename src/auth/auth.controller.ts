import { Body, Controller, Post , HttpCode} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { User } from 'generated/prisma';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Post('signup')
    signUp(@Body() dto : AuthDto): Promise<(Omit<User,"password">) | null> {
        return this.authService.signUp(dto);
    }

    
    @HttpCode(200)
    @Post('signin')
    signIn(@Body() dto : AuthDto): Promise<{access_token : string} | null> {
        return this.authService.signIn(dto);
    }

}
