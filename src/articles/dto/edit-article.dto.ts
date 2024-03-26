import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditArticleDto {

    @IsString()
    title?: string;

    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    id:number;

}