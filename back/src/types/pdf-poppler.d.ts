// back/src/types/pdf-poppler.d.ts

declare module 'pdf-poppler' {
    export class PDFImage {
      constructor(filePath: string, options?: {
        outputDirectory?: string;
        format?: string;
        width?: number;
        height?: number;
      });
      /**
       * Converte todas as páginas do PDF em imagens
       * @returns Array de caminhos (strings) para as imagens geradas
       */
      convertFile(): Promise<string[]>;
    }
  }
  