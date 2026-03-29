import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove properties not in DTO
      forbidNonWhitelisted: true, // throw error if unknown property is sent
      transform: true,            // auto-transform payloads (e.g. string -> number)
    }),
  );

  app.use("/uploads", express.static(join(__dirname, "..", "uploads")));

  const port = process.env.PORT ?? 4000;

  await app.listen(port);

  console.log(`connected on port ` + port);
}
bootstrap();
