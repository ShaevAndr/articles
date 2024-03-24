import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async CreateUser(@Body() user: CreateUserDto) {
        return await this.userService.create(user);
    }

    @Get('get_all')
    async getUsers() {
        return await this.userService.findAll();
    }

    @Post('get')
    async getUser(@Body() param) {
        return await this.userService.findOne({ email: param.email });
    }

    @Get('remove_all')
    async removeUsers() {
        return this.userService.deleteAll();
    }

    @Post('remove')
    async delete(@Body() user) {
        return this.userService.delete(user.id);
    }


}
