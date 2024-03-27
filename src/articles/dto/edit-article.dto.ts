import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditArticleDto {
    
    @ApiProperty({ example: 'Новое название статьи', description: 'Новое название статьи' })
    @IsString()
    @IsOptional()
    title?: string;
    
    @ApiProperty({ example: 'Новое описание статьи', description: 'Новое описание статьи' })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({ example: '5', description: 'Id  статьи' })
    @IsNotEmpty()
    @IsNumber()
    id: number;

}