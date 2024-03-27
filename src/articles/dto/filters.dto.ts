import { IsEmail, IsISO8601, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PagesDto {

    @ApiPropertyOptional({ example: '10', description: 'Количесво загружаемых статей' })
    @IsNumberString()
    @IsOptional()
    limit?: string

    @ApiPropertyOptional({ example: '3', description: 'Номер страницы' })
    @IsNumberString()
    @IsOptional()
    page?: string

}

export class FiltersDto extends PagesDto {

    @ApiPropertyOptional({ example: 'нов', description: 'Фильтрация по названию. С учётом регистра(только сейчас об этом подумал)' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: 'Привет ;)', description: 'Поиск по описанию' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ example: 'xxx@yyy.com', description: 'Поиск по Email автора ' })
    @IsEmail()
    @IsOptional()
    author?: string;

    @ApiPropertyOptional({ example: '2024-01-01T05-05-500Z', description: 'Фильтрация по дате. От ...' })
    @IsISO8601()
    @IsOptional()
    from?: string

    @ApiPropertyOptional({ example: '2024-01-01T05-05-500Z', description: 'Фильтрация по дате. До ...' })
    @IsISO8601()
    @IsOptional()
    to?: string

}

