import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  /** 
   * Chama um serviço de OCR e retorna o texto extraído.
   * Aqui, inicialmente, é um mock.
   */
  async extractText(filePath: string): Promise<string> {
    this.logger.log(`Iniciando OCR para ${filePath}`);
    // TODO: implementar chamada real ao provedor de OCR
    return 'TEXTO EXTRAÍDO (mock)';
  }
}
