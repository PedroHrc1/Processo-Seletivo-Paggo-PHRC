"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// back/src/main.ts
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({ origin: 'http://localhost:3000', credentials: true });
    // Validação global de DTOs (strip de propriedades não declaradas)
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    // Porta padrão — ajuste se quiser outra
    const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
    await app.listen(PORT);
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map