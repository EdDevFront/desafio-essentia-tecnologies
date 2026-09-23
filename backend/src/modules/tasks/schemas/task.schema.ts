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

const transformFn = (_doc: unknown, ret: Record<string, unknown> | object): void => {
  const target = ret as Record<string, unknown>;
  target['id'] = target['_id'] ? (target['_id'] as object).toString() : target['id'];
  if (target['userId']) {
    target['userId'] = (target['userId'] as object).toString();
  }
  delete target['_id'];
  delete target['__v'];
};

TaskSchema.set('toJSON', { virtuals: true, transform: transformFn });
TaskSchema.set('toObject', { virtuals: true, transform: transformFn });
