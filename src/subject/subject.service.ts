import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SubjectDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectService {

    constructor(private prisma: PrismaService) { }

    async index() {
        try {
            return await this.prisma.subject.findMany();
        } catch (error) {
            throw error;
        }
    }

    async store(user: User, dto: SubjectDto) {
        try {
            //check if subject already exist
            const getSubject = await this.prisma.subject.findFirst({
                where: {
                    name: dto.name
                }
            });

            if(getSubject) throw new ConflictException('Subject already exist!');
            
            //if doesnt, save it in DB
            const newSubject = await this.prisma.subject.create({
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
