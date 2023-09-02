import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { SubjectDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { SubjecUpdatetDto } from './dto/subject.update.dto';
import { ResponseService } from '../response/response.service';

@Injectable()
export class SubjectService {

    constructor(private prisma: PrismaService, private readonly responseService: ResponseService) { }

    async index() {
        try {
            const getUserList = await this.prisma.subject.findMany();
            return this.responseService.positiveResponse(getUserList);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
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

            if (getSubject) throw new ConflictException('Subject already exist!');

            //if doesnt, save it in DB
            const newSubject = await this.prisma.subject.create({
                data: {
                    name: dto.name
                }
            });

            return this.responseService.positiveResponse(newSubject);

        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

    async update(id: number, dto: SubjecUpdatetDto) {
        try {
            //check if subject exist
            const getSubject = await this.prisma.subject.findFirst({
                where: {
                    id: id
                }
            });

            if (!getSubject) throw new NotFoundException('Subject not found!');

            const updateSubject = await this.prisma.subject.update({
                where: {
                    id: getSubject.id
                },
                data: {
                    name: dto.name || undefined
                }
            });

            return this.responseService.positiveResponse(updateSubject);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }
}
