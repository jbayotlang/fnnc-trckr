import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@modules/config/config.service';
import { CustomValidationPipe } from '@lib/validation.pipe'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configApp = app.get(ConfigService);

  app.useGlobalPipes(new CustomValidationPipe());

  await app.listen(configApp.appConfig.port, configApp.appConfig.hostname);
}
bootstrap();
