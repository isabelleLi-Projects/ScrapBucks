import { Module, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostController } from "./controller/post.controller";
import { RecyclingLocationsController } from './controller/calRecycle.controller';
import { RecyclingLocationsService } from './services/recyclingLocation.service';
@Module({
  imports: [],
  controllers: [AppController, PostController, RecyclingLocationsController],
  providers: [AppService, RecyclingLocationsService],
})
export class AppModule {}
