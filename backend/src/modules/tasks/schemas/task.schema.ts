import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export type TaskDocument = Task & Document;

@Schema({ timestamps: true, versionKey: false })
export class Task {
  id: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ trim: true })
  category?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

const transformFn = (_doc: any, ret: any) => {
  ret.id = ret._id ? ret._id.toString() : ret.id;
  if (ret.userId) {
    ret.userId = ret.userId.toString();
  }
  delete ret._id;
  delete ret.__v;
};

TaskSchema.set('toJSON', { virtuals: true, transform: transformFn });
TaskSchema.set('toObject', { virtuals: true, transform: transformFn });
