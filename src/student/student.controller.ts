import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { StudentService } from './student.service';
import { StudentDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('student')
export class StudentController {

    constructor(private studentService: StudentService){}

    @HttpCode(HttpStatus.OK)
    @Get('all')
    index(){
        return this.studentService.index();
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('store')
    store(@GetUser() user: User, @Body() dto: StudentDto){
        return this.studentService.store(user, dto);
    }
}
