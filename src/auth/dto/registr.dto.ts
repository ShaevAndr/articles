import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

export class RegistrDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}