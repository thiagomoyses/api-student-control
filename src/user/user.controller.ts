import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    @HttpCode(HttpStatus.OK)
    @Get('me')
    getMe(@GetUser() user: User){
        return user;
    }
}
