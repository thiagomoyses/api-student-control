import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class StudentDto {
    
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
    phone: string
}