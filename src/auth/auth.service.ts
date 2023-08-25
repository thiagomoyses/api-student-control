import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SignInDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signup(dto: AuthDto) {

        //generate pass
        const hash = await argon.hash(dto.password);

        try {
            //save and return
            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    hash,
                    idUser: dto.idUser
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            });

            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new ForbiddenException('Credentials already taken!');
                    default:
                        break;
                }
            } else {
                throw error;
            }
        }
    }

    async signin(dto: SignInDto) {

        try {
            //find user by email
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            });

            //guard condition, if does not exist, error
            if (!user) throw new ForbiddenException("Incorrect credentials!");

            //compare pass
            const pwMatches = await argon.verify(user.hash, dto.password);

            //guard condition, if pass incorrect, error
            if (!pwMatches) throw new ForbiddenException("Incorrect credentials!");


            //send back the user
            delete user.hash;
            delete user.firstName
            delete user.lastName;
            delete user.idUser
            
            return user;

        } catch (error) {
            throw error;
        }
    }
}