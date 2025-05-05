"use strict";
// back/src/modules/documents/documents.controller.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const documents_service_1 = require("./documents.service");
let DocumentsController = class DocumentsController {
    constructor(docsService) {
        this.docsService = docsService;
    }
    /**
     * POST /documents
     * Recebe multipart/form-data com campo 'file'
     */
    async create(req, file) {
        const user = req.user;
        const dto = {
            originalName: file.originalname,
            filePath: `/uploads/${file.filename}`,
        };
        return this.docsService.createDocument(user.userId, dto);
    }
    /**
     * GET /documents
     * Lista todos os documentos do usuário
     */
    async findAll(req) {
        const user = req.user;
        return this.docsService.findAll(user.userId);
    }
    /**
     * GET /documents/:id
     * Retorna um documento específico, com texto extraído e interações
     */
    async findOne(req, id) {
        const user = req.user;
        return this.docsService.findOne(user.userId, id);
    }
};
exports.DocumentsController = DocumentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(__dirname, '../../../uploads'),
            filename: (_req, file, callback) => {
                const uniqueName = `${Date.now()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (_req, file, callback) => {
            // aceita somente jpg, jpeg, png ou pdf
            if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
                return callback(new Error('Tipo de arquivo não suportado'), false);
            }
            callback(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findOne", null);
exports.DocumentsController = DocumentsController = __decorate([
    (0, common_1.Controller)('documents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
//# sourceMappingURL=documents.controller.js.map