"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ocr_service_1 = require("../ocr/ocr.service");
let DocumentsService = class DocumentsService {
    constructor(prisma, ocrService) {
        this.prisma = prisma;
        this.ocrService = ocrService;
    }
    /** Cria um novo documento */
    async createDocument(userId, dto) {
        const document = await this.prisma.document.create({
            data: {
                userId,
                originalName: dto.originalName,
                filePath: dto.filePath,
            },
        });
        // Dispara OCR sem bloquear a resposta HTTP
        this.ocrService
            .extractText(dto.filePath)
            .then((text) => {
            return this.prisma.extractedText.create({
                data: {
                    documentId: document.id,
                    content: text,
                },
            });
        })
            .catch((err) => {
            // log de erro mas não interrompe a aplicação
            console.error('Erro ao processar OCR:', err);
        });
        return document;
    }
    /** Lista todos os documentos de um usuário */
    async findAll(userId) {
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
    async findOne(userId, id) {
        const doc = await this.prisma.document.findUnique({
            where: { id },
            include: {
                extractedText: true,
                interactions: { orderBy: { timestamp: 'asc' } },
            },
        });
        if (!doc) {
            throw new common_1.NotFoundException(`Document with id ${id} not found`);
        }
        if (doc.userId !== userId) {
            throw new common_1.ForbiddenException(`You do not have access to this document`);
        }
        return doc;
    }
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ocr_service_1.OcrService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map