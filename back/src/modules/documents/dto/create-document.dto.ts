import { IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  originalName!: string;

  @IsString()
  filePath!: string;
}
