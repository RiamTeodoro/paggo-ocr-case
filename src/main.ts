import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.userGlobalPipes(
      new ValidationPipe ({
        whitelist: true,
      }),
    );

    await app.init();
  }

  return server;
}
  export default bootstrap();