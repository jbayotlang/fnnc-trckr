import { NestFactory } from '@nestjs/core';

import { CustomValidationPipe } from '@lib/validation.pipe'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new CustomValidationPipe());

  await app.listen(3000);
}
bootstrap();
