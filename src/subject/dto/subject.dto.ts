import { IsNotEmpty, IsString } from "class-validator";

export class SubjectDto {
    @IsNotEmpty()
    @IsString()
    name: string
}