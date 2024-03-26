import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditArticleDto {

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    id: number;

}