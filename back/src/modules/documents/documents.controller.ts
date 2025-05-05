// back/src/modules/documents/documents.controller.ts

import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { DocumentsService } from './documents.service';
  import { CreateDocumentDto } from './dto/create-document.dto';
  
  @Controller('documents')
  @UseGuards(JwtAuthGuard)
  export class DocumentsController {
    constructor(private readonly docsService: DocumentsService) {}
  
    /**
     * POST /documents
     * Cria um novo documento
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
      @Req() req: Request,
      @Body() dto: CreateDocumentDto,
    ) {
      const user = (req.user as any);
      const created = await this.docsService.createDocument(user.userId, dto);
      return created;
    }
  
    /**
     * GET /documents
     * Lista todos os documentos do usuário
     */
    @Get()
    async findAll(@Req() req: Request) {
      const user = (req.user as any);
      const list = await this.docsService.findAll(user.userId);
      return list;
    }
  
    /**
     * GET /documents/:id
     * Retorna um documento específico, com texto e interações
     */
    @Get(':id')
    async findOne(
      @Req() req: Request,
      @Param('id') id: string,
    ) {
      const user = (req.user as any);
      const doc = await this.docsService.findOne(user.userId, id);
      return doc;
    }
  }
  