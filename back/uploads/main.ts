// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve arquivos estáticos de /uploads via /uploads/*
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Monta lista de origens permitidas
  const allowedOrigins = [
    'http://localhost:3000',                         // dev local
    process.env.NEXT_PUBLIC_FRONTEND_URL || ''       // front deployado
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const PORT = parseInt(process.env.PORT) || 4000;
  await app.listen(PORT);
  console.log(`🚀 API rodando na porta ${PORT}`);
}
bootstrap();
