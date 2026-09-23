import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'techx_secret_key_2026',
    });
  }

  async validate(payload: { sub: string; email: string }) {
    try {
      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Sessão inválida ou expirada. Faça login novamente.');
      }
      return user.toJSON();
    } catch {
      throw new UnauthorizedException('Sessão inválida ou expirada. Faça login novamente.');
    }
  }
}
