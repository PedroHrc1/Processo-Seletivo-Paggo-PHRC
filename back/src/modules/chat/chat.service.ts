import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { Interaction } from '@prisma/client';

type CohereV2Response = {
  text?: string;
  generations?: { text: string }[];
  [key: string]: any;
};

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly cohereClient = axios.create({
    baseURL: 'https://api.cohere.ai/v2',
    headers: {
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  constructor(private readonly prisma: PrismaService) {
    if (!process.env.COHERE_API_KEY) {
      throw new Error('COHERE_API_KEY não está definida no .env');
    }
  }

  async chat(
    userId: string,
    documentId: string,
    userMessage: string,
  ): Promise<{ userInteraction: Interaction; assistantInteraction: Interaction }> {
    this.logger.debug({ userId, documentId, userMessage }, 'chat() início');

    // 1) buscar documento + validar
    const doc = await this.prisma.document.findUnique({
      where: { id: documentId },
      include: { extractedText: true },
    });
    if (!doc || doc.userId !== userId) {
      throw new NotFoundException('Documento não encontrado ou acesso negado');
    }
    const text = doc.extractedText?.content;
    if (!text) {
      throw new BadRequestException('Texto ainda não processado pelo OCR');
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

    let answer: string;
    try {
      const res = await this.cohereClient.post<CohereV2Response>(
        '/generate',
        {
          model: 'command',
          prompt,
          max_tokens: 300,
          temperature: 0.5,
          stop_sequences: ['\n\n'],
        },
      );
      const data = res.data;
      this.logger.debug({ data }, 'Cohere respondeu');

      if (data.text) {
        answer = data.text.trim();
      } else if (Array.isArray(data.generations) && data.generations.length) {
        answer = data.generations[0].text.trim();
      } else {
        throw new Error('Resposta inválida da LLM');
      }
      if (!answer) throw new Error('Resposta vazia da LLM');
    } catch (err: any) {
      this.logger.error(
        'Erro ao chamar Cohere',
        err.response?.data || err.message,
      );
      throw new ServiceUnavailableException(
        'Serviço de chat indisponível. Tente novamente mais tarde.',
      );
    }

    // 4) grava resposta da assistente
    const assistantInteraction = await this.prisma.interaction.create({
      data: { documentId, role: 'assistant', message: answer },
    });

    return { userInteraction, assistantInteraction };
  }
}
