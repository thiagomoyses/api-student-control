import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GradebookDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';

@Injectable()
export class GradebookService {

    constructor(private prisma: PrismaService, private readonly responseService: ResponseService) { }

    async index(user: User) {

        try {
            const getAll = await this.prisma.gradeBook.findMany({
                where: {
                    userId: user.userRefCode
                }
            });

            return this.responseService.positiveResponse(getAll);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

    async store(studentRefCode: string, user: User, dto: GradebookDto) {

        try {
            //look for user
            const getStudent = await this.prisma.student.findUnique({
                where: {
                    studentRefCode: studentRefCode
                }
            });

            if (!getStudent) return new NotFoundException("Student does not exist!");

            //look for subject
            const getSubject = await this.prisma.subject.findUnique({
                where: {
                    id: dto.subject_id
                }
            })

            if (!getSubject) return new NotFoundException("Subject does not exist!");


            //Add new grade
            const newGrade = await this.prisma.gradeBook.create({
                data: {
                    studentRef: studentRefCode,
                    subjectId: dto.subject_id,
                    grade: dto.grade,
                    userId: user.userRefCode
                }
            });

            return this.responseService.positiveResponse(newGrade);
        } catch (error) {
            throw error;
            // throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

}
