// back/src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { OcrModule } from './modules/ocr/ocr.modules';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DocumentsModule,
    OcrModule,
  ],
})
export class AppModule {}
