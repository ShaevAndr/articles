import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegistrDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authServices: AuthService
    ) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const tokens = await this.authServices.login(dto);
        if (!tokens) {
            throw new BadRequestException(`Не получается войти с данными ${JSON.stringify(dto)}`);
        }
        return { tokens }
    }

    @Post('registr')
    async registr(@Body() dto: RegistrDto) {
        const user = await this.authServices.registr(dto);
        if (!user) {
            throw new BadRequestException(
                `Не получается зарегистрировать пользователя с данными ${JSON.stringify(dto)}`,
            );
        }
        return user;
    }

    @Post('refresh-tokens')
    async refreshTokens(@Body() token: RefreshTokenDto) {
        const tokens = await this.authServices.refreshToken(token.token);
        if (!tokens) {
            throw new UnauthorizedException();
        }
        return tokens
    }

    @Post('logout')
    async logout(@Body() token: RefreshTokenDto) {
        await this.authServices.deleteRefreshToken(token.token);
    }
}
