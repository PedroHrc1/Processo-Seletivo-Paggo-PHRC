"use strict";
// back/src/modules/ocr/ocr.service.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var OcrService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs/promises"));
const pdf2pic_1 = require("pdf2pic");
const tesseract_js_1 = __importStar(require("tesseract.js"));
let OcrService = OcrService_1 = class OcrService {
    constructor() {
        this.logger = new common_1.Logger(OcrService_1.name);
    }
    /**
     * Extrai texto de um PDF multi-página:
     * 1) PDF → PNGs via pdf2pic + GraphicsMagick
     * 2) OCR de cada PNG (idioma 'por')
     * 3) Limpeza de arquivos temporários
     */
    async extractText(filePath) {
        this.logger.log(`Iniciando OCR para ${filePath}`);
        // 1) Caminho absoluto do PDF
        const normalized = filePath.replace(/^[/\\]+/, '');
        const absPdf = path.resolve(process.cwd(), normalized);
        this.logger.debug(`PDF absoluto: ${absPdf}`);
        // 2) Diretorio temporário para imagens
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ocr-'));
        // 3) Converter PDF em PNGs (GraphicsMagick)
        const converter = (0, pdf2pic_1.fromPath)(absPdf, {
            density: 150,
            saveFilename: 'page',
            savePath: tmpDir,
            format: 'png',
            width: 1240,
            height: 1754,
            graphicsMagick: true,
        });
        const pages = await converter.bulk(-1);
        if (!pages.length) {
            throw new Error('Falha ao converter PDF em imagens');
        }
        this.logger.log(`Geradas ${pages.length} imagem(ns) para OCR`);
        // 4) Cria o worker (já pré-carregado nas versões recentes)
        const worker = await tesseract_js_1.default.createWorker();
        // 5) OCR página a página
        let fullText = '';
        for (const { path: imgPath, page } of pages) {
            this.logger.log(`OCR página ${page}: ${imgPath}`);
            // opcional: ajustar PSM
            await worker.setParameters({ tessedit_pageseg_mode: tesseract_js_1.PSM.AUTO });
            const { data } = await worker.recognize(imgPath, 'por');
            fullText += `\n\n--- Página ${page} ---\n\n${data.text}`;
        }
        // 6) Finaliza o worker
        await worker.terminate();
        this.logger.log(`OCR concluído: ${fullText.length} caracteres extraídos`);
        // 7) Limpeza de arquivos temporários
        await Promise.all(pages.map(p => fs.unlink(p.path)));
        await fs.rmdir(tmpDir);
        return fullText.trim();
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = OcrService_1 = __decorate([
    (0, common_1.Injectable)()
], OcrService);
//# sourceMappingURL=ocr.service.js.map