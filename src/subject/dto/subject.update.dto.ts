import { IsString } from "class-validator";

export class SubjecUpdatetDto {
    @IsString()
    name: string

    @IsString()
    studentRefId: string
}