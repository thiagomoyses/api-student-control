import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { SubjectService } from './subject.service';
import { SubjectDto } from './dto';
import { SubjecUpdatetDto } from './dto/subject.update.dto';

@UseGuards(JwtGuard)
@Controller('subject')
export class SubjectController {
    constructor(private subjectService: SubjectService){}
    
    @HttpCode(HttpStatus.OK)
    @Get('all')
    index(){
        return this.subjectService.index();
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('store')
    store(@GetUser() user: User, @Body() dto: SubjectDto){
        return this.subjectService.store(user, dto);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('update:id')
    update(@Param('id') id: number, @Body() dto: SubjecUpdatetDto){
        return this.subjectService.update(id, dto);
    }
}
