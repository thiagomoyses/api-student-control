import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { StudenUpdateDto, StudentDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import { ResponseService } from '../response/response.service';

@Injectable()
export class StudentService {

    constructor(private prisma: PrismaService, private readonly responseService: ResponseService) { }

    async index(user: User) {

        try {
            const studentList = await this.prisma.student.findMany({
                where: {
                    userId: user.userRefCode
                }
            });

            return this.responseService.positiveResponse(studentList);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

    async store(user: User, dto: StudentDto) {
        try {
            //generate StudentRef
            const nameFirstLeter = dto.firstName.substring(0, 1);
            const lastNameFirstLeter = dto.lastName.substring(0, 1);
            const date = new Date();
            const randomNumber = Math.floor(Math.random() * 900) + 100;

            const studentRefCode = nameFirstLeter.toUpperCase() + lastNameFirstLeter.toUpperCase() + randomNumber + date.getTime();


            //check if student already exist
            const getStudent = await this.prisma.student.findFirst({
                where: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    userId: user.userRefCode
                }
            });

            if (getStudent) throw new ConflictException("Student already registered!");


            //save new student
            const student = await this.prisma.student.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    studentRefCode: studentRefCode,
                    email: dto.email,
                    phone: dto.phone,
                    user: { connect: { userRefCode: user.userRefCode } },
                    parent: { connect: { id: dto.parent_id } }
                }
            });

            delete student.userId;

            return this.responseService.positiveResponse(student);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new ForbiddenException('Student Already Registered!');
                    default:
                        break;
                }
            } else {
                throw new InternalServerErrorException('We had a probem, try again later!');
            }

        }
    }

    async update(id: number, dto: StudenUpdateDto) {
        try {
            const getStudent = await this.prisma.student.findUnique({
                where: {
                    id: id
                }
            });

            if (!getStudent) throw new NotFoundException("Student not found");

            const updateStudent = await this.prisma.student.update({
                where: {
                    id: getStudent.id
                },
                data: {
                    firstName: dto.firstName || undefined,
                    lastName: dto.lastName || undefined,
                    email: dto.email || undefined,
                    phone: dto.phone || undefined,
                    parent_id: dto.parent_id || undefined
                }
            });

            return this.responseService.positiveResponse(updateStudent);
        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }
}