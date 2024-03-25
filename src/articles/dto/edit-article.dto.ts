import { IsNotEmpty, IsString } from 'class-validator';

export class EditArticleDto {

    @IsString()
    title?: string;

    @IsString()
    description?: string;

}