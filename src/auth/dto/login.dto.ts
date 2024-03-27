import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'xxx@yyy.com', description: 'Email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'авыпаывпэ', description: 'Пароль, не меньше 6 символов' })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}