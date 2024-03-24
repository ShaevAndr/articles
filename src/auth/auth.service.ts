import { Token } from './entites/token.entity';
import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '@user/user.service';
import { Repository } from 'typeorm';
import { LoginDto, RegistrDto } from './dto';
import { User } from '@user/entites/user.entites';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async login(dto: LoginDto) {
        const user: User = await this.userService.findOne({ email: dto.email })
            .catch((err) => {
                this.logger.error(err);
                return null;
            });
        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Не верный логин или пароль');
        }
        return await this.generateTokens(user);
    }

    async registr(dto: RegistrDto) {
        const user: User = await this.userService.findOne({ email: dto.email }).catch((err) => {
            this.logger.error(err);
            return null;
        });
        if (user) {
            throw new ConflictException('Пользователь с таким email уже зарегистрирован');
        }
        return this.userService.create(dto).catch((err) => {
            this.logger.error(err);
            return null;
        });
    }

    async refreshToken(refreshToken: string) {
        const tok = await this.tokenRepository.find({ relations: ['user'] })
        console.log(tok[0])
        const token = await this.tokenRepository.findOne({ relations: ['user'], where: { token: refreshToken } });
        if (!token || new Date(token.exp) < new Date()) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.findOne({ id: token.user.id });
        return this.generateTokens(user);
    }

    async generateTokens(user: User) {
        const accessToken =
            await this.jwtService.sign({
                id: user.id,
                email: user.email,
                roles: user.roles,
            });
        const refreshToken = await this.getRefreshToken(user);
        return { accessToken, refreshToken };
    }

    private async getRefreshToken(user: User): Promise<Token> {
        const currentDate = new Date()
        const exp = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
        // console.log(user)
        await this.tokenRepository.delete({
            user: user,
        }).catch((err) => {
            return null
        });

        return this.tokenRepository.save({
            token: v4(),
            exp: String(exp),
            user: user,
        })
    }

    async deleteRefreshToken(token: string): Promise<void> {
        console.log(await this.tokenRepository.delete({ token }))
    }

}
