import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { Request } from 'express';
import { NewArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';
import { JwtPayload } from '@auth/types/JwtPayload';
import { FiltersDto } from './dto/filters.dto';
import { ARTICLES_ENDPOINTS } from '../constants/endpoints'
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Article } from './entity/article.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('Api статей')
@Controller(ARTICLES_ENDPOINTS.ROOT)
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) { }

    @ApiOperation({ summary: 'Создать новую статью' })
    @UseGuards(JwtAuthGuard)
    @Post(ARTICLES_ENDPOINTS.ADD)
    async addArticle(@Body() dto: NewArticleDto, @Req() req: Request):Promise<Article>  {
        const user = req.user as JwtPayload
        return await this.articlesService.create(dto, user.id)
    }
    
    @ApiOperation({ summary: 'Редактировать статью' })
    @UseGuards(JwtAuthGuard)
    @Post(ARTICLES_ENDPOINTS.EDIT)
    async editArticle(@Body() dto: EditArticleDto, @Req() req: Request):Promise<Article>  {
        const user = req.user as JwtPayload
        return await this.articlesService.edit(dto, user.id)
    }

    @ApiOperation({ summary: 'Удалить статью' })
    @UseGuards(JwtAuthGuard)
    @Get(`${ARTICLES_ENDPOINTS.DELETE}/:id`)
    async deleteArticle(@Param('id') id: number, @Req() req: Request):Promise<DeleteResult>  {
        const user = req.user as JwtPayload
        return await this.articlesService.delete(id, user.id)
    }

    @ApiOperation({ summary: 'Загрузить все статьи (есть возможность пагинации)' })
    @Get(ARTICLES_ENDPOINTS.GET_ALL)
    async getAllArticles(@Query() params: FiltersDto):Promise<Article[]>  {
        return await this.articlesService.getAll(params)
    }

    @ApiOperation({ summary: 'Загрузить статью по id' })
    @Get(`${ARTICLES_ENDPOINTS.GET}/:id`)
    async getArticleById(@Param('id') id: number):Promise<Article> {
        return await this.articlesService.getById(id)
    }

    @ApiOperation({ summary: 'Поиск в коллекции по параметрам' })
    @Get(ARTICLES_ENDPOINTS.FIND)
    async getArticle(@Query() params: FiltersDto):Promise<Article[]> {
        return await this.articlesService.find(params)
    }

}
