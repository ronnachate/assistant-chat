import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@assistant-chat/mongodb';

@Schema({ versionKey: false })
export class Assistant extends AbstractDocument {
  @Prop()
  assistantID: string;
}

export const AssistantSchema = SchemaFactory.createForClass(Assistant);
