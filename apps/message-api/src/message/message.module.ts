import { Module } from '@nestjs/common';
import { MessageService } from './services/message.service';
import { MessageRepository } from './repositories/message.repository';
import { Message, MessageSchema } from './schemas/message.schema';
import {
  Assistant,
  AssistantSchema,
} from './schemas/assistant.schema';
import { AssistantRepository } from './repositories/assistant.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiService } from './services/openai.service';
import { SeqLoggerModule } from '@jasonsoft/nestjs-seq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageController } from './controllers/message.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_EXCHANGE_TOPIC } from '@assistant-chat/constants';
import { EventService } from './services/event.service';

@Module({
  imports: [
    SeqLoggerModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Assistant.name, schema: AssistantSchema },
    ]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: configService.get<string>('rabbitmq.exchangeName'),
            type: RABBITMQ_EXCHANGE_TOPIC,
          },
        ],
        uri: configService.get<string>('rabbitmq.uri'),
      }),
    }),
  ],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepository,
    AssistantRepository,
    OpenaiService,
    EventService,
  ],
  exports: [MessageService, OpenaiService, EventService],
})
export class MessageModule {}
