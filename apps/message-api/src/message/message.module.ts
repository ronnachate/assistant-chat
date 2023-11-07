import { Module } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { MessageRepository } from './repositories/message.repository';
import { Message, MessageSchema } from './schemas/message.schema';
import { Assistant, AssistantSchema } from '../assistant/schemas/assistant.schema';
import { AssistantRepository } from '../assistant/repositories/assistant.repository';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Assistant.name, schema: AssistantSchema }
    ])],
  providers: [MessageService, MessageRepository, AssistantRepository],
  exports: [MessageService],
})
export class MessageModule {}