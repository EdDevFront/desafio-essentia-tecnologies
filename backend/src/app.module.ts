import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    MongooseModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
