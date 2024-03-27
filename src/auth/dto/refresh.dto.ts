import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RefreshTokenDto {
    @ApiProperty({ example: 'fdsada-fdasgfsdg-dsfgdsf-sdfs', description: 'Refresh token' })
    @IsString()
    @IsNotEmpty()
    token: string;
}