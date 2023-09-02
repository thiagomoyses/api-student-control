import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
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

    @HttpCode(HttpStatus.CREATED)
    @Post('store/:studentRefCode')
    store(@Param('studentRefCode') studentRefCode: string, @GetUser() user: User, @Body() dto: GradebookDto){
        return this.gradebookService.store(studentRefCode, user, dto);
    }

}
