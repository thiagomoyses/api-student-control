import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ParentService } from './parent.service';
import { ParentDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';


@UseGuards(JwtGuard)
@Controller('parent')
export class ParentController {
    constructor(private parentService: ParentService){}

    @Get('all')
    index(@GetUser() user: User){
        return this.parentService.index(user);
    }

    @Post('store')
    store(@GetUser() user: User, @Body() dto: ParentDto){
        return this.parentService.store(user, dto);
    }
    
}
