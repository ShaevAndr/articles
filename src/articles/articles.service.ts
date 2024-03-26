import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { Repository } from 'typeorm';
import { UserService } from '@user/user.service';
import { NewArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';
import { FiltersDto, PagesDto } from './dto/filters.dto';

@Injectable()
export class ArticlesService {
    private readonly logger = new Logger(ArticlesService.name)
    constructor(
        @InjectRepository(Article) private readonly articlesRepository: Repository<Article>,
        private readonly userService: UserService
    ) { }

    async create(article: NewArticleDto, userId: string) {
        const user = await this.userService.findOne({ id: userId })
        return await this.articlesRepository.save(
            {
                ...article,
                author: user
            }
        )
    }

    async delete(articleId: number, userId: string) {
        await this.validateArticleAutor(articleId, userId)
        return await this.articlesRepository.delete({ id: articleId })
    }

    async edit(updatedArticle: EditArticleDto, userId) {
        const articleInBase = await this.validateArticleAutor(updatedArticle.id, userId)
        Object.assign(articleInBase, updatedArticle)
        return await this.articlesRepository.save(articleInBase)
    }

    async find(queryParams: FiltersDto): Promise<Article[]> {
        const query = await this.articlesRepository.createQueryBuilder('article');

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

        return await query.getMany();
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

        return await this.articlesRepository.find({})
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
