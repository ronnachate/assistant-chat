import { Module } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { MessageRepository } from './repositories/message.repository';
import { Message, MessageSchema } from './schemas/message.schema';
import { Assistant, AssistantSchema } from '../assistant/schemas/assistant.schema';
import { AssistantRepository } from '../assistant/repositories/assistant.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiService } from './services/openai.service';
import { SeqLoggerModule } from '@jasonsoft/nestjs-seq';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SeqLoggerModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Assistant.name, schema: AssistantSchema }
    ])],
  providers: [MessageService, MessageRepository, AssistantRepository, OpenaiService],
  exports: [MessageService, OpenaiService],
})
export class MessageModule {}