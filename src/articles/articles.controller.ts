import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '@auth/guards/auth.guard';
import { Request } from 'express';
import { NewArticleDto } from './dto/create-article.dto';
import { EditArticleDto } from './dto/edit-article.dto';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('add')
    async addArticle(@Body() dto: NewArticleDto, @Req() req: Request) {
        return await this.articlesService.create(dto, req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('edit')
    async editArticle(@Body() dto: EditArticleDto, @Req() req: Request) {
        return await this.articlesService.edit(dto, req.user.id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('delete/:id')
    async deleteArticle(@Param('id') id: number, @Req() req: Request) {
        return await this.articlesService.delete(id, req.user.id)
    }

    @Get('get_all')
    async getAllArticles() {
        return await this.articlesService.getAll()
    }

    @Get('get/:id')
    async getArticleById(@Param('id') id: number) {
        return await this.articlesService.getById(id)
    }

    @Get('find')
    async getArticle(@Query() query: Record<string, string>) {
        return await this.articlesService.find(query)
    }

}
