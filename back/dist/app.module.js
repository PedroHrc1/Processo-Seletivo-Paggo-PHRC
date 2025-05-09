"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// back/src/app.module.ts
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const documents_module_1 = require("./modules/documents/documents.module");
const ocr_modules_1 = require("./modules/ocr/ocr.modules");
const chat_module_1 = require("./modules/chat/chat.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            documents_module_1.DocumentsModule,
            ocr_modules_1.OcrModule,
            chat_module_1.ChatModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map