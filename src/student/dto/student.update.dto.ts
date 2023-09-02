import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class StudenUpdateDto {
    @IsString()
    firstName: string

    @IsString()
    lastName: string

    @IsEmail()
    email: string

    @IsString()
    phone: string

    @IsNotEmpty()
    parent_id: number
}