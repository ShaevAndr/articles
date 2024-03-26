import { IsEmail, IsISO8601, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PagesDto {

    @IsNumberString()
    @IsOptional()
    limit?: string

    @IsNumberString()
    @IsOptional()
    page?: string

}

export class FiltersDto extends PagesDto {

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEmail()
    @IsOptional()
    author?: string;

    @IsISO8601()
    @IsOptional()
    from?: string

    @IsISO8601()
    @IsOptional()
    to?: string

}

