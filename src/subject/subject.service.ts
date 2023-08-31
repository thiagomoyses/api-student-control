import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { SubjectDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { SubjecUpdatetDto } from './dto/subject.update.dto';

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

    async update(id: number, dto: SubjecUpdatetDto){
        //check if subject exist
        const getSubject = await this.prisma.subject.findFirst({
            where: {
                id: id
            }
        });

        if(!getSubject) throw new NotFoundException('Subject not found!');

        const updateSubject = await this.prisma.subject.update({
            where: {
                id: getSubject.id
            },
            data: {
                name: dto.name
            }
        });

        return updateSubject;
    }
}
