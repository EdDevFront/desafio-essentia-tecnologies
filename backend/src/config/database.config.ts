import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDatabaseConfig(): TypeOrmModuleOptions {
  const isProd = process.env.NODE_ENV === 'production';
  const dbType = process.env.DB_TYPE || 'sqlite';

  if (dbType === 'mysql') {
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'techx_user',
      password: process.env.DB_PASSWORD || 'techx_password',
      database: process.env.DB_NAME || 'techx_tasks',
      autoLoadEntities: true,
      synchronize: !isProd,
    };
  }

  return {
    type: 'sqlite',
    database: process.env.DB_SQLITE_PATH || 'techx_db.sqlite',
    autoLoadEntities: true,
    synchronize: true,
  };
}
