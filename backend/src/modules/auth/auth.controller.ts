import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserProfileDto, AuthResponseDto } from './dto/user-profile.dto';
import { 
  BadRequestErrorDto, 
  UnauthorizedErrorDto, 
  ConflictErrorDto, 
  InternalServerErrorDto 
} from '../../common/dto/error-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastrar novo usuário TechX' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Dados de registro inválidos ou incompletos', type: BadRequestErrorDto })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado na plataforma', type: ConflictErrorDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: InternalServerErrorDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos', type: BadRequestErrorDto })
  @ApiResponse({ status: 401, description: 'Credenciais (e-mail ou senha) inválidas', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: InternalServerErrorDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente, expirado ou inválido', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: InternalServerErrorDto })
  getProfileInfo(@GetUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado (alias /me)' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Não autorizado - Token ausente, expirado ou inválido', type: UnauthorizedErrorDto })
  @ApiResponse({ status: 500, description: 'Erro interno no servidor', type: InternalServerErrorDto })
  getProfile(@GetUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }
}
