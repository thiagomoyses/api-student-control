import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GradebookDto {
    @IsNotEmpty()
    @IsInt()
    subject_id: number

    @IsNotEmpty()
    @IsNumber({allowInfinity: false, allowNaN: false})
    grade: number
}