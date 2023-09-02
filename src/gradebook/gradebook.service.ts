import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GradebookDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ResponseService } from '../response/response.service';

@Injectable()
export class GradebookService {

    constructor(private prisma: PrismaService, private readonly responseService: ResponseService) { }

    index(user: User) {

        try {
            const getAll = this.prisma.gradeBook.findMany({
                where: {
                    userId: user.userRefCode
                }
            });

            return this.responseService.positiveResponse(getAll);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

    store(studentRefCode: string, user: User, dto: GradebookDto) {

        try {
            //look for user
            const getStudent = this.prisma.student.findUnique({
                where: {
                    studentRefCode: studentRefCode
                }
            });

            if (!getStudent) throw new NotFoundException("Student does not exist!");

            //look for subject
            const getSubject = this.prisma.subject.findUnique({
                where: {
                    id: dto.subject_id
                }
            })

            if (!getSubject) throw new NotFoundException("Subject does not exist!");


            //Add new grade
            const newGrade = this.prisma.gradeBook.create({
                data: {
                    studentRef: studentRefCode,
                    subjectId: dto.subject_id,
                    grade: dto.grade,
                    userId: user.userRefCode
                }
            });

            return this.responseService.positiveResponse(newGrade);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

}
