import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { UserModule } from '@user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), UserModule, CacheModule],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule { }
