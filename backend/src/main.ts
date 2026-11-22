import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startCalRecycleSyncJob } from './jobs/calRecycleSync.job';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  startCalRecycleSyncJob();
  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
