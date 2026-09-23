import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado na plataforma.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    const token = this.generateToken(savedUser.id, savedUser.email);

    return {
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password || ''))) {
      throw new UnauthorizedException('E-mail ou senha incorretos. Verifique suas credenciais.');
    }

    const token = this.generateToken(user.id, user.email);
    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Perfil de usuário não encontrado.');
    }
    delete user.password;
    return user;
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
