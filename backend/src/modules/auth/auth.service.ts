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
    const normalizedEmail = dto.email.toLowerCase();
    const existingUser = await this.userModel.findOne({ email: normalizedEmail });
    const isEmailAlreadyRegistered = Boolean(existingUser);

    if (isEmailAlreadyRegistered) {
      throw new ConflictException('Este e-mail já está cadastrado na plataforma.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = new this.userModel({
      name: dto.name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();
    const userId = savedUser._id.toString();
    const token = this.generateToken(userId, savedUser.email);

    return {
      user: { id: userId, name: savedUser.name, email: savedUser.email },
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const normalizedEmail = dto.email.toLowerCase();
    const user = await this.userModel.findOne({ email: normalizedEmail });
    const isUserNotFound = !user;
    const isPasswordValid = user ? await bcrypt.compare(dto.password, user.password || '') : false;
    const isInvalidCredentials = isUserNotFound || !isPasswordValid;

    if (isInvalidCredentials) {
      throw new UnauthorizedException('E-mail ou senha incorretos. Verifique suas credenciais.');
    }

    const userId = user!._id.toString();
    const token = this.generateToken(userId, user!.email);
    return {
      user: { id: userId, name: user!.name, email: user!.email },
      accessToken: token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    const isUserMissing = !user;

    if (isUserMissing) {
      throw new UnauthorizedException('Perfil de usuário não encontrado.');
    }
    return user.toJSON();
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
