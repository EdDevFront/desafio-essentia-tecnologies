import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Identificador único do usuário' })
  id: string;

  @ApiProperty({ example: 'Edmilson Motta', description: 'Nome completo do usuário' })
  name: string;

  @ApiProperty({ example: 'edd.contato@gmail.com', description: 'Endereço de e-mail do usuário' })
  email: string;

  @ApiProperty({ example: '2026-09-23T10:00:00.000Z', description: 'Data de criação da conta' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-23T10:00:00.000Z', description: 'Data da última atualização' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserProfileDto, description: 'Dados do perfil do usuário autenticado' })
  user: UserProfileDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token de acesso JWT Bearer' })
  accessToken: string;
}
