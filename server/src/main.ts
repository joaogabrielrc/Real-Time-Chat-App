/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const hostname = process.env.HOSTNAME ?? '127.0.0.1';
  const port = process.env.PORT ?? 8000;

  await app.listen(port, hostname, () =>
    console.log(`Server running at http://${hostname}:${port}/`)
  );
}
bootstrap();
