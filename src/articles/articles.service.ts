import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { UserService } from '@user/user.service';
import { NewArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';

@Injectable()
export class ArticlesService {
    private readonly logger = new Logger(ArticlesService.name)
    constructor(
        @InjectRepository(Article) private readonly articlesRepository: Repository<Article>,
        private readonly userService: UserService
    ) { }

    async create(article: NewArticleDto, userId: string) {

    }

    async delete(articleId: number, userId: string) {

    }

    async edit(article: EditArticleDto, userId) {

    }

    async find(query) {

    }

    async getById(articleId: number) {

    }

    async getAll() {

    }


}
