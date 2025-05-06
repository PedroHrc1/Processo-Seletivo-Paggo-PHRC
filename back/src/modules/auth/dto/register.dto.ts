import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()            // nome não pode ser vazio
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
