import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Token } from './entites';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { env } from 'process';
import { UserModule } from '@user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Token]),
        JwtModule.register({
            global: true,
            secret: 'env.SECRET',
            signOptions: { expiresIn: '60m' },
        }),
        UserModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule { }