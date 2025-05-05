import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DocumentsModule,
    // outros módulos...
  ],
})
export class AppModule {}
