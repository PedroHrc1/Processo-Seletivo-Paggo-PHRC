// back/src/modules/ocr/ocr.service.ts

import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs/promises';
import { fromPath, Page } from 'pdf2pic';
import Tesseract, { PSM } from 'tesseract.js';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  /**
   * Extrai texto de um PDF multi-página:
   * 1) PDF → PNGs via pdf2pic + GraphicsMagick
   * 2) OCR de cada PNG (idioma 'por')
   * 3) Limpeza de arquivos temporários
   */
  async extractText(filePath: string): Promise<string> {
    this.logger.log(`Iniciando OCR para ${filePath}`);

    // 1) Caminho absoluto do PDF
    const normalized = filePath.replace(/^[/\\]+/, '');
    const absPdf = path.resolve(process.cwd(), normalized);
    this.logger.debug(`PDF absoluto: ${absPdf}`);

    // 2) Diretorio temporário para imagens
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ocr-'));

    // 3) Converter PDF em PNGs (GraphicsMagick)
    const converter = fromPath(absPdf, {
      density: 150,
      saveFilename: 'page',
      savePath: tmpDir,
      format: 'png',
      width: 1240,
      height: 1754,
      graphicsMagick: true,
    });
    const pages: Page[] = await converter.bulk(-1);
    if (!pages.length) {
      throw new Error('Falha ao converter PDF em imagens');
    }
    this.logger.log(`Geradas ${pages.length} imagem(ns) para OCR`);

    // 4) Cria o worker (já pré-carregado nas versões recentes)
    const worker = await Tesseract.createWorker();

    // 5) OCR página a página
    let fullText = '';
    for (const { path: imgPath, page } of pages) {
      this.logger.log(`OCR página ${page}: ${imgPath}`);
      // opcional: ajustar PSM
      await worker.setParameters({ tessedit_pageseg_mode: PSM.AUTO } as any);
      const { data } = await worker.recognize(imgPath, 'por' as any);
      fullText += `\n\n--- Página ${page} ---\n\n${data.text as string}`;
    }

    // 6) Finaliza o worker
    await worker.terminate();
    this.logger.log(`OCR concluído: ${fullText.length} caracteres extraídos`);

    // 7) Limpeza de arquivos temporários
    await Promise.all(pages.map(p => fs.unlink(p.path)));
    await fs.rmdir(tmpDir);

    return fullText.trim();
  }
}
