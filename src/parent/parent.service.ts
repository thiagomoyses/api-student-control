import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ParentDto } from './dto';
import { GetUser } from '../auth/decorator';
import { ResponseService } from '../response/response.service';

@Injectable()
export class ParentService {

    constructor(private prisma: PrismaService, private readonly responseService: ResponseService){}

    async index(user: User){
        try {
            //get all parents
            const parentList = await this.prisma.parent.findMany({
                where: {
                    userId: user.userRefCode
                }
            });

            return this.responseService.positiveResponse(parentList);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

    async store(@GetUser() user: User, dto: ParentDto){
        try {
            //check if parent already exist
            const getParent = await this.prisma.parent.findFirst({
                where: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    userId: user.userRefCode
                }
            });
            
            if(getParent) throw new ConflictException("Parent already exist");

            //if not, save new parent
            const saveNewParent = await this.prisma.parent.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    phone: dto.phone,
                    email: dto.email,
                    student: {
                        connect: dto.student.map(studentId => ({ id: studentId }))
                    },
                    userId: user.userRefCode
                }
            });

            return this.responseService.positiveResponse(saveNewParent);
            
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }
}