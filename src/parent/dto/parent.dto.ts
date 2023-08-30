import { IsArray, IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class ParentDto{
    
    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    phone: string

    @IsArray()
    @IsInt({ each: true })
    student: number[];
}