import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorators';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';





@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get('me')
    getMe(@GetUser() user: User, @GetUser('email') email: string) {
        console.log({ "email": email })
        return this.userService.getMe(user.id)
    }

    @Patch()
    editUser(
        @GetUser('sub') userId: string,
        @Body() dto: EditUserDto
    ) {
        return this.userService.editUser(userId,dto)
    }
}
