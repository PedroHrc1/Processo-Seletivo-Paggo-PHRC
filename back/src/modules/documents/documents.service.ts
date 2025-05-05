import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Cria um novo documento */
  async createDocument(userId: string, dto: CreateDocumentDto) {

    const document = await this.prisma.document.create({
      data: {
        userId,
        originalName: dto.originalName,
        filePath: dto.filePath,
      },
    });

    return document;
  }

  /** Lista todos os documentos de um usuário */
  async findAll(userId: string) {
    const docs = await this.prisma.document.findMany({
      where: { userId },
      include: {
        // traz também o texto extraído e o número de interações
        extractedText: true,
        _count: { select: { interactions: true } },
      },
      orderBy: { uploadedAt: 'desc' },
    });

    return docs;
  }

  /** Busca um documento específico, garantindo que pertença ao usuário */
  async findOne(userId: string, id: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: {
        extractedText: true,
        interactions: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!doc) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    if (doc.userId !== userId) {
      throw new ForbiddenException(`You do not have access to this document`);
    }

    return doc;
  }
}
