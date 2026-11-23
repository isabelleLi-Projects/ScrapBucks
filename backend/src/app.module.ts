import { Module, Post } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostController } from "./controller/post.controller";
import { RecyclingLocationsController } from './controller/calRecycle.controller';
import { RecyclingLocationsService } from './services/recyclingLocation.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
@Module({
  imports: [],
  controllers: [AppController, PostController, RecyclingLocationsController, AuthController],
  providers: [AppService, RecyclingLocationsService, AuthService],
})
export class AppModule {}
