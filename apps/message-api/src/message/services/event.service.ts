import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_ASSISTANT_CREATE_ROUTING } from '@assistant-chat/constants';
import { AssistantDTO } from '@assistant-chat/dtos';

@Injectable()
export class EventService {

  
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: SeqLogger
  ) {
  }

  @RabbitRPC({
    exchange: process.env.RABBITMQ_EXCHANGE_NAME,
    routingKey: RABBITMQ_ASSISTANT_CREATE_ROUTING,
  })
  public async assistantCreatedHandler(assistantDto: {}) {
    this.logger.info('assistantCreatedHandler recieved', { assistantDto });
    return {
      response: 42,
    };
  }
}
