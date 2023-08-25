import { Controller, Get } from '@nestjs/common';

@Controller('student')
export class StudentController {
    @Get('index')
    index(){
        return "cheguei";    
    }
}
