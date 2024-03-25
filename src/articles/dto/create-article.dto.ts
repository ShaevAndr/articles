import { IsNotEmpty, IsString } from 'class-validator';

export class NewArticleDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

}