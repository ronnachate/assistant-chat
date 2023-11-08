import { Injectable } from '@nestjs/common';
import { AssistantDTO } from '@assistant-chat/dtos';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_ASSISTANT_CREATE_ROUTING } from '@assistant-chat/constants';
import { ConfigService } from '@nestjs/config';
import { SeqLogger } from '@jasonsoft/nestjs-seq';


@Injectable()
export class EventService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
    private readonly logger: SeqLogger
  ) {}

  async publishAssistantCreatedEvent(assistant: AssistantDTO) {
    try {
      await this.amqpConnection.publish(
        this.configService.get<string>('rabbitmq.exchangeName'),
        RABBITMQ_ASSISTANT_CREATE_ROUTING,
        assistant
      );
    } catch (error) {
      this.logger.error('publishAssistantCreatedEvent error', {
        module: EventService.name,
        error: error,
      });
    }
  }
}
