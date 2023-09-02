import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '..//auth/guard';
import { GradebookService } from './gradebook.service';
import { GradebookDto } from './dto';

@UseGuards(JwtGuard)
@Controller('gradebook')
export class GradebookController {

    constructor(private gradebookService: GradebookService){}

    @HttpCode(HttpStatus.OK)
    @Get('all')
    index(@GetUser() user: User){
        return this.gradebookService.index(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('store:id')
    store(@Param() studentRefCode: string, @GetUser() user: User, dto: GradebookDto){
        return this.gradebookService.store(studentRefCode, user, dto);
    }

}
