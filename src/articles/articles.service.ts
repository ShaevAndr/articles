import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { UserService } from '@user/user.service';
import { NewArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';
import { FiltersDto, PagesDto } from './dto/filters.dto';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ArticlesService {
    private readonly logger = new Logger(ArticlesService.name)
    constructor(
        @InjectRepository(Article) private readonly articlesRepository: Repository<Article>,
        private readonly userService: UserService,
        private readonly cacheService: CacheService,
    ) { }

    async create(article: NewArticleDto, userId: string) {
        const user = await this.userService.findOne({ id: userId })
        await this.cacheService.delete('*')
        return await this.articlesRepository.save(
            {
                ...article,
                author: user
            }
        )
    }

    async delete(articleId: number, userId: string) {
        await this.validateArticleAutor(articleId, userId)
        const response = await this.articlesRepository.delete({ id: articleId })
        await this.cacheService.delete('*')
        return response
    }

    async edit(updatedArticle: EditArticleDto, userId) {
        const articleInBase = await this.validateArticleAutor(updatedArticle.id, userId)
        Object.assign(articleInBase, updatedArticle)
        const response = await this.articlesRepository.save(articleInBase)
        await this.cacheService.delete('*')
        return response
    }

    async find(queryParams: FiltersDto): Promise<Article[]> {
        const cacheKey = JSON.stringify(queryParams);
        const query = await this.articlesRepository.createQueryBuilder('article');

        let articles = await this.cacheService.get(cacheKey);
        if (articles) {
            return articles
        }

        if (queryParams.title) {
            query.andWhere('article.title LIKE :title', {
                title: `%${queryParams.title}%`,
            });
        }

        if (queryParams.description) {
            query.andWhere('article.description LIKE :description', {
                description: `%${queryParams.description}%`,
            });
        }


        if (queryParams.from) {
            query.andWhere('article.publishDate > :from', { from: queryParams.from });
        }

        if (queryParams.to) {
            query.andWhere('article.publishDate < :to', { to: queryParams.to });
        }

        if (queryParams.author) {
            await query.leftJoin('article.author', 'user')
            query.andWhere('user.email = :author', { author: queryParams.author });
        }

        if (queryParams.limit) {
            query.take(Number(queryParams.limit))

            if (queryParams.page) {
                const offset = (Number(queryParams.page) - 1) * Number(queryParams.limit);
                query.skip(offset)
            }
        }

        const queryResult = await query.getMany();
        await this.cacheService.set(cacheKey, queryResult, 6000);
        return queryResult
    }

    async getById(articleId: number) {
        return await this.articlesRepository.findOneBy({ id: articleId })
    }

    async getAll(queryParams: PagesDto) {
        const query = await this.articlesRepository.createQueryBuilder('article');
        if (queryParams.limit) {
            query.take(Number(queryParams.limit))

            if (queryParams.page) {
                const offset = (Number(queryParams.page) - 1) * Number(queryParams.limit);
                query.skip(offset)
            }
        }

        return await await query.getMany();
    }

    private async validateArticleAutor(articleId: number, userId: string): Promise<Article> {
        const article = await this.articlesRepository.findOne({
            where: { id: articleId },
            relations: ['author']
        })

        if (!article) {
            throw new NotFoundException('нет такой статьи')
        }

        console.log(article)
        if (article.author.id !== userId) {
            throw new ForbiddenException('Вы не являетесь автором')
        }
        return article
    }

}
