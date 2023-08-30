import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { StudentDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';

@Injectable()
export class StudentService {

    constructor(private prisma: PrismaService) { }

    async index(user: User) {

        try {
            const studentList = await this.prisma.student.findMany({
                where: {
                    userId: user.userRefCode
                }
            });

            return this.response(studentList);
        } catch (error) {
            throw error;
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

            if(getStudent) throw new ConflictException("Student already registered!");


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

            return this.response(student);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new ForbiddenException('Student Already Registered!');
                    default:
                        break;
                }
            } else {
                throw error;
            }

        }
    }

    private response(payload) {
        const response = {
            "message": "success",
            "data": { payload }
        }

        return response;
    }
}