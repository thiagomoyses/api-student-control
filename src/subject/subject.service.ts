import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SubjectDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectService {

    constructor(private prisma: PrismaService) { }

    index() {
        try {
            return this.prisma.subject.findMany();
        } catch (error) {
            throw error;
        }
    }

    store(user: User, dto: SubjectDto) {
        try {
            //check if subject already exist
            const getSubject = this.prisma.subject.findFirst({
                where: {
                    name: dto.name
                }
            });

            if(getSubject) throw new ConflictException('Subject already exist!');
            
            //if doesnt, save it in DB
            const newSubject = this.prisma.subject.create({
                data: {
                    name: dto.name
                }
            });

            return newSubject;

        } catch (error) {
            throw error;
        }
    }
}
