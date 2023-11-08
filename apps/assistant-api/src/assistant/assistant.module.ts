import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantController } from './controllers/assistant.controller';
import { AssistantService } from './services/assistant.service';
import { AssistantRepository } from './repositories/assistant.repository';
import { Assistant } from './entities/assistant.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RABBITMQ_EXCHANGE_TOPIC } from '@assistant-chat/constants';
import { EventService } from './services/event.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Assistant]),
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
  controllers: [AssistantController],
  providers: [AssistantService, AssistantRepository, EventService],
  exports: [AssistantService, EventService],
})
export class AssistantModule {}
