import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { StudentService } from './student.service';
import { StudenUpdateDto, StudentDto } from './dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('student')
export class StudentController {

    constructor(private studentService: StudentService){}

    @HttpCode(HttpStatus.OK)
    @Get('all')
    index(@GetUser() user: User){
        return this.studentService.index(user);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('store')
    store(@GetUser() user: User, @Body() dto: StudentDto){
        return this.studentService.store(user, dto);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('update/:id')
    update(@Param('id') id: number, @Body() dto: StudenUpdateDto){
        return this.studentService.update(id, dto);
    }
}
