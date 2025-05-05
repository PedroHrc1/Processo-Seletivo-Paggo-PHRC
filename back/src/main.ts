// back/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  // Validação global de DTOs (strip de propriedades não declaradas)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Porta padrão — ajuste se quiser outra
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
  await app.listen(PORT);
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
}

bootstrap();
