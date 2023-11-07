import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@assistant-chat/mongodb';

@Schema({ versionKey: false })
export class Message extends AbstractDocument {

  //Nouse schema relation, no not need for now
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Assistant.name })
  // @Type(() => Assistant)
  @Prop()
  assistantID: string;

  @Prop()
  typeID: number;

  @Prop()
  content: string;

  @Prop()
  isGptResponse: boolean;

  @Prop()
  gptResponse: string;

  @Prop()
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
