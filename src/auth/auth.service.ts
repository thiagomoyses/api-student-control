import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, SignInDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

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
                    userRefCode: dto.userRefCode
                    
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

            return this.signToken(user.id, user.userRefCode);

        } catch (error) {
            throw error;
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