import { MongooseModuleOptions } from '@nestjs/mongoose';

export function getDatabaseConfig(): MongooseModuleOptions {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techx_tasks';
  return {
    uri,
  };
}
