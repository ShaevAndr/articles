import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewArticleDto {
    
    @ApiProperty({ example: 'Возьмите меня на работу', description: 'Название статьи' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Это божественная статья о ...', description: 'Описание статьи' })
    @IsString()
    @IsNotEmpty()
    description: string;

}