import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AUTH_ENDPOINTS } from 'src/constants/endpoints';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegistrDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Авторизация')
@Controller(AUTH_ENDPOINTS.ROOT)
export class AuthController {
    constructor(
        private readonly authServices: AuthService
    ) { }

    @ApiOperation({ summary: 'Логин' })
    @Post(AUTH_ENDPOINTS.LOGIN)
    async login(@Body() dto: LoginDto) {
        const tokens = await this.authServices.login(dto);
        if (!tokens) {
            throw new BadRequestException(`Не получается войти с данными ${JSON.stringify(dto)}`);
        }
        return { tokens }
    }

    @ApiOperation({ summary: 'Регистрация' })
    @Post(AUTH_ENDPOINTS.REGISTRATION)
    async registr(@Body() dto: RegistrDto) {
        const user = await this.authServices.registr(dto);
        if (!user) {
            throw new BadRequestException(
                `Не получается зарегистрировать пользователя с данными ${JSON.stringify(dto)}`,
            );
        }
        return user;
    }

    @ApiOperation({ summary: 'Обновление токена' })
    @Post(AUTH_ENDPOINTS.REFRESH_TOKEN)
    async refreshTokens(@Body() token: RefreshTokenDto) {
        const tokens = await this.authServices.refreshToken(token.token);
        if (!tokens) {
            throw new UnauthorizedException();
        }
        return tokens
    }

    @ApiOperation({ summary: 'Logout' })
    @Post(AUTH_ENDPOINTS.LOGOUT)
    async logout(@Body() token: RefreshTokenDto) {
        await this.authServices.deleteRefreshToken(token.token);
    }
}
