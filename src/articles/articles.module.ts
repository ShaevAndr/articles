import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { UserModule } from '@user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule { }
