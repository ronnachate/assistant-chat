import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@assistant-chat/mongodb';

@Schema({ versionKey: false })
export class Assistant extends AbstractDocument {
  @Prop()
  assistantID: string;

  @Prop()
  createdAt: Date;

  public constructor(assistantID: string) {
    super();
    this.assistantID = assistantID;
    this.createdAt = new Date();
  }
}

export const AssistantSchema = SchemaFactory.createForClass(Assistant);
