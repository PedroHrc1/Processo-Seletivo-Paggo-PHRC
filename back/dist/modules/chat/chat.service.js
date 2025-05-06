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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../../prisma/prisma.service");
let ChatService = ChatService_1 = class ChatService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ChatService_1.name);
        this.cohereClient = axios_1.default.create({
            baseURL: 'https://api.cohere.ai/v2',
            headers: {
                Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        if (!process.env.COHERE_API_KEY) {
            throw new Error('COHERE_API_KEY não está definida no .env');
        }
    }
    async chat(userId, documentId, userMessage) {
        this.logger.debug({ userId, documentId, userMessage }, 'chat() início');
        // 1) buscar documento + validar
        const doc = await this.prisma.document.findUnique({
            where: { id: documentId },
            include: { extractedText: true },
        });
        if (!doc || doc.userId !== userId) {
            throw new common_1.NotFoundException('Documento não encontrado ou acesso negado');
        }
        const text = doc.extractedText?.content;
        if (!text) {
            throw new common_1.BadRequestException('Texto ainda não processado pelo OCR');
        }
        // 2) grava pergunta do usuário
        const userInteraction = await this.prisma.interaction.create({
            data: { documentId, role: 'user', message: userMessage },
        });
        // 3) chama a Cohere fora de transação
        const prompt = `
Abaixo está o conteúdo de uma fatura, já extraído via OCR:

${text}

Com base neste texto, responda à pergunta do usuário de forma clara e objetiva.

Pergunta: ${userMessage}

Resposta:
`.trim();
        let answer;
        try {
            const res = await this.cohereClient.post('/generate', {
                model: 'command',
                prompt,
                max_tokens: 300,
                temperature: 0.5,
                stop_sequences: ['\n\n'],
            });
            const data = res.data;
            this.logger.debug({ data }, 'Cohere respondeu');
            if (data.text) {
                answer = data.text.trim();
            }
            else if (Array.isArray(data.generations) && data.generations.length) {
                answer = data.generations[0].text.trim();
            }
            else {
                throw new Error('Resposta inválida da LLM');
            }
            if (!answer)
                throw new Error('Resposta vazia da LLM');
        }
        catch (err) {
            this.logger.error('Erro ao chamar Cohere', err.response?.data || err.message);
            throw new common_1.ServiceUnavailableException('Serviço de chat indisponível. Tente novamente mais tarde.');
        }
        // 4) grava resposta da assistente
        const assistantInteraction = await this.prisma.interaction.create({
            data: { documentId, role: 'assistant', message: answer },
        });
        return { userInteraction, assistantInteraction };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = ChatService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map