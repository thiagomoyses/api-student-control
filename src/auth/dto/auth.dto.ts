import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    
    @IsNotEmpty()
    @IsString()
    firstName: string
    
    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    idUser: string
}