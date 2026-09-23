import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('Este e-mail já está cadastrado na plataforma.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = new this.userModel({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();
    const token = this.generateToken(savedUser.id, savedUser.email);

    return {
      user: { id: savedUser.id, name: savedUser.name, email: savedUser.email },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
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
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Perfil de usuário não encontrado.');
    }
    return user.toJSON();
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
