import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  id: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

const transformFn = (_doc: unknown, ret: Record<string, unknown> | object): void => {
  const target = ret as Record<string, unknown>;
  target['id'] = target['_id'] ? (target['_id'] as object).toString() : target['id'];
  delete target['_id'];
  delete target['__v'];
  delete target['password'];
};

UserSchema.set('toJSON', { virtuals: true, transform: transformFn });
UserSchema.set('toObject', { virtuals: true, transform: transformFn });
