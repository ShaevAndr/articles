import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { User } from '@user/entites/user.entites';
import { JwtPayload } from '@auth/types/JwtPayload';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'env.SECRET',
        });
    }
    private readonly logger = new Logger(JwtStrategy.name)

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        const user: User = await this.userService.findOne({ id: payload.id }).catch((err) => {
            this.logger.error(err);
            return null;
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException();
        }
        return payload;
    }
}
