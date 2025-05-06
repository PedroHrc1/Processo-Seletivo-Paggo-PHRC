import { IsString } from 'class-validator';

export class CreateInteractionDto {
  @IsString()
  message!: string;
}
