// back/src/types/pdf2pic.d.ts

import { Stream } from 'stream';

declare module 'pdf2pic' {
  export interface Options {
    density?: number;
    saveFilename?: string;
    savePath?: string;
    format?: string;
    width?: number;
    height?: number;
    /**
     * Se true, força o uso de GraphicsMagick (`gm`) ao invés de ImageMagick (`convert`)
     */
    graphicsMagick?: boolean;
  }

  export interface Page {
    page: number;
    name: string;
    path: string;
  }

  /**
   * Constrói um conversor que pode gerar arquivos no disco
   */
  export function fromPath(
    pdfPath: string,
    options?: Options
  ): {
    bulk: (pages: number[] | -1) => Promise<Page[]>;
  };
}
