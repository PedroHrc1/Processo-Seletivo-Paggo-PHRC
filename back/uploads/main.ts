// backend/src/main.ts

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

import { AppModule } from '../src/app.module';

async function bootstrap() {
  // 1) Cria a aplicação Nest usando o adaptador Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2) (Opcional) Se quiser prefixar todas as rotas com /api, descomente:
  // app.setGlobalPrefix('api');

  // 3) Habilita CORS globalmente para aceitar requisições do frontend
  //    Use FRONTEND_URL no Vercel para apontar para o domínio do seu front em produção.
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 4) Serve arquivos estáticos da pasta uploads em /uploads/*
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 5) Adiciona validação global com DTOs (whitelist: remove propriedades extra)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 6) Inicia o servidor na porta configurada (padrão 4000)
  const PORT = parseInt(process.env.PORT, 10) || 4000;
  await app.listen(PORT);
  console.log(`🚀 API rodando na porta ${PORT} (CORS permitido para ${frontendUrl})`);
}

bootstrap();
