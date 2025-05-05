import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { OcrModule } from '../ocr/ocr.modules';

@Module({
  imports: [PrismaModule, OcrModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}