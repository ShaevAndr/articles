import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token } from './entites';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { UserModule } from '@user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Token]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              global:true,
              signOptions: { expiresIn: '60m' },
            }),
          }),
        UserModule],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule { }