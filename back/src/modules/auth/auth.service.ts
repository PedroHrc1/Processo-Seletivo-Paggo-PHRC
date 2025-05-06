import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1) verifica duplicidade
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // 2) hash da senha
    const hash = await bcrypt.hash(dto.password, 10);

    // 3) cria usuário
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: hash,
      },
    });

    // 4) remova hash antes de retornar
    delete (user as any).passwordHash;
    return user;
  }

  /** Verifica credenciais e retorna o usuário se válido */
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  /** Gera o JWT para o usuário */
  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }
    const payload = { userId: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
