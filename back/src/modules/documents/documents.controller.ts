// back/src/modules/documents/documents.controller.ts

import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly docsService: DocumentsService) {}

  /**
   * POST /documents
   * Recebe multipart/form-data com campo 'file'
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../../uploads'),
        filename: (_req, file, callback) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (_req, file, callback) => {
        // aceita somente jpg, jpeg, png ou pdf
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return callback(new Error('Tipo de arquivo não suportado'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  async create(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = req.user as any;
    const dto = {
      originalName: file.originalname,
      filePath: `/uploads/${file.filename}`,
    };
    return this.docsService.createDocument(user.userId, dto);
  }

  /**
   * GET /documents
   * Lista todos os documentos do usuário
   */
  @Get()
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    return this.docsService.findAll(user.userId);
  }

  /**
   * GET /documents/:id
   * Retorna um documento específico, com texto extraído e interações
   */
  @Get(':id')
  async findOne(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const user = req.user as any;
    return this.docsService.findOne(user.userId, id);
  }
}
