import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}
    async signup(dto: AuthDto){

        //generate pass
        const hash = await argon.hash(dto.password);
        
        //save the new user
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

        //return saved user
        return user;
    }

    signin(){
        return "I am signin";
    }
}