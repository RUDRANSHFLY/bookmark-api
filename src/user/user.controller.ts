import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'types';
import { UserService } from './user.service';





@Controller('users')
export class UserController {

    constructor(private readonly userService : UserService){}

    @UseGuards(AuthGuard)
    @Get('me')
    getMe(@Req() req: RequestWithUser) {
        return this.userService.getMe(req.user.sub)
    }
}
