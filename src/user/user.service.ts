import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entites';
import { Repository } from 'typeorm';
import { hashSync, genSaltSync } from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }
    async create(user: Partial<User>) {
        return await this.userRepository.save({
            email: user.email,
            password: this.hashPassword(user.password),
        });
    }

    async update(user: Partial<User>) {
        const userInBase = await this.userRepository.findOne({ where: { email: user.email } })
        Object.assign(userInBase, user)

        if (user.password) {
            userInBase.password = this.hashPassword(user.password)
        }

        return this.userRepository.save(userInBase)
    }

    async findOne({ id, email }: { id?: string, email?: string }) {
        if (!id && !email) {
            throw new BadRequestException('нет данных для поиска')
        }
        return await this.userRepository.findOne({
            where: id ? { id } : { email }
        })
    }

    async delete(id: string) {
        return await this.userRepository.delete({ id })
    }

    async deleteAll() {
        return await this.userRepository.delete({})
    }

    async findAll() {
        return await this.userRepository.find({})
    }

    private hashPassword = (password: string): string => {
        return hashSync(password, genSaltSync(10));
    };
}
