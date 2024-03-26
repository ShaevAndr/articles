import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
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
        return await this.articlesRepository.save(
            {
                ...article,
                author: userId
            }
        )
    }

    async delete(articleId: number, userId: string) {
        return await this.articlesRepository.delete({id:articleId})
    }

    async edit(updatedArticle: EditArticleDto, userId) {
        const articleInBase = await this.articlesRepository.findOneBy({id:updatedArticle.id})
        if (articleInBase.author !== userId ) {
            throw new ForbiddenException('Вы не являетесь автором')
        }
        Object.assign(articleInBase, updatedArticle)
        return await this.articlesRepository.save(articleInBase)
    }

    async find(queryParams) {
        const query = await this.articlesRepository.createQueryBuilder('article');

        if (queryParams.title) {
          query.andWhere('article.title LIKE :title', {
            title: `%${queryParams.title}%`,
          });
        }
    
        if (queryParams.authorId) {
          query.andWhere('article.authorId = :authorId', { authorId: queryParams.authorId });
        }
    
        if (queryParams.publishDate) {
          query.andWhere('article.publishDate = :publishDate', { publishDate: queryParams.publishDate });
        }
    
        return await query.getMany();
    }

    async getById(articleId: number) {
        return await this.articlesRepository.findOneBy({id:articleId})
    }

    async getAll() {
        return await this.articlesRepository.find({})
    }


}
