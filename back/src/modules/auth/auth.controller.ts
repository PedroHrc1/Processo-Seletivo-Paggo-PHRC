import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../documents/dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  /**
   * POST /auth/login
   * Recebe email e senha, retorna { access_token }
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
