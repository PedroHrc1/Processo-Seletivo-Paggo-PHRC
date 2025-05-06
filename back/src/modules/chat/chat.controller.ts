import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

class CreateInteractionDto {
  message: string;
}

@Controller('documents/:id/interactions')
@UseGuards(JwtAuthGuard)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(
    @Param('id') documentId: string,
    @Body('message') userMessage: string,
    @Req() req: Request & { user: { userId: string } },
  ) {
    this.logger.debug(
      { documentId, userId: req.user.userId, userMessage },
      'POST /interactions',
    );
    const result = await this.chatService.chat(
      req.user.userId,
      documentId,
      userMessage,
    );
    return result;
  }
}
