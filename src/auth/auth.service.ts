import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto, SignInDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ResponseService } from "../response/response.service";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
        private readonly responseService: ResponseService
    ) { }

    async signup(dto: AuthDto) {

        //generate pass
        const hash = await argon.hash(dto.password);

        try {
            //create userRefCode
            const nameFirstLeter = dto.firstName.substring(0, 1);
            const lastNameFirstLeter = dto.lastName.substring(0, 1);
            const date = new Date();
            const randomNumber = Math.floor(Math.random() * 900) + 100;
            
            const userRefCode = nameFirstLeter.toUpperCase() + lastNameFirstLeter.toUpperCase() + randomNumber + date.getTime();

            //save and return
            const user = await this.prisma.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    hash,
                    userRefCode: userRefCode
                    
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    userRefCode: true
                }
            });

            return this.responseService.positiveResponse(user);
            
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                switch (error.code) {
                    case 'P2002':
                        throw new ForbiddenException('Credentials already taken!');
                    default:
                        break;
                }
            } else {
                throw new InternalServerErrorException('We had a probem, try again later!');
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

            const token = await this.signToken(user.id, user.userRefCode);
            return  this.responseService.positiveResponse(token);

        } catch (error) {
            throw new InternalServerErrorException('We had a probem, try again later!');
        }
    }

    async signToken(id: number, userRefCode: string): Promise<{ access_token: string }> {

        const payload = {
            sub: id,
            userRefCode
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15min',
            secret: this.config.get('JWT_SECRET')
        });

        return {
            access_token: token,
        }
    }
}