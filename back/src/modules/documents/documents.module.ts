// back/src/modules/documents/documents.module.ts

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { OcrModule } from '../ocr/ocr.modules';

@Module({
  imports: [
    PrismaModule,
    OcrModule,
    MulterModule.register({
      dest: './uploads',          
    }),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
