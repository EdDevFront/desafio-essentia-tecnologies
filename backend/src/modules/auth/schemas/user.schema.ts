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

const transformFn = (_doc: any, ret: any) => {
  ret.id = ret._id ? ret._id.toString() : ret.id;
  delete ret._id;
  delete ret.__v;
  delete ret.password;
};

UserSchema.set('toJSON', { virtuals: true, transform: transformFn });
UserSchema.set('toObject', { virtuals: true, transform: transformFn });
