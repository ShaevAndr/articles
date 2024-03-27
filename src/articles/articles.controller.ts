import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { Request } from 'express';
import { NewArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';
import { JwtPayload } from '@auth/types/JwtPayload';
import { FiltersDto } from './dto/filters.dto';
import { ARTICLES_ENDPOINTS } from '../constants/endpoints'

@Controller(ARTICLES_ENDPOINTS.ROOT)
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) { }


    @UseGuards(JwtAuthGuard)
    @Post(ARTICLES_ENDPOINTS.ADD)
    async addArticle(@Body() dto: NewArticleDto, @Req() req: Request) {
        const user = req.user as JwtPayload
        return await this.articlesService.create(dto, user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post(ARTICLES_ENDPOINTS.EDIT)
    async editArticle(@Body() dto: EditArticleDto, @Req() req: Request) {
        const user = req.user as JwtPayload
        return await this.articlesService.edit(dto, user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${ARTICLES_ENDPOINTS.DELETE}/:id`)
    async deleteArticle(@Param('id') id: number, @Req() req: Request) {
        const user = req.user as JwtPayload
        return await this.articlesService.delete(id, user.id)
    }

    @Get(ARTICLES_ENDPOINTS.GET_ALL)
    async getAllArticles(@Query() params: FiltersDto) {
        console.log('get')
        return await this.articlesService.getAll(params)
    }

    @Get(`${ARTICLES_ENDPOINTS.GET}/:id`)
    async getArticleById(@Param('id') id: number) {
        return await this.articlesService.getById(id)
    }

    @Get(ARTICLES_ENDPOINTS.FIND)
    async getArticle(@Query() params: FiltersDto) {
        return await this.articlesService.find(params)
    }

}
