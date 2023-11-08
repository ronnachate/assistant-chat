import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_ASSISTANT_CREATE_ROUTING } from '@assistant-chat/constants';
import { AssistantDTO } from '@assistant-chat/dtos';
import { AssistantRepository } from '../repositories/assistant.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly assistantRepository: AssistantRepository,
    private readonly logger: SeqLogger
  ) {}

  @RabbitRPC({
    exchange: process.env.RABBITMQ_EXCHANGE_NAME,
    routingKey: RABBITMQ_ASSISTANT_CREATE_ROUTING,
  })
  public async assistantCreatedHandler(assistantDto: AssistantDTO) {
    try {
      this.logger.info('assistantCreatedHandler recieved', { assistantDto });
      var newAssistant = {
        assistantID: assistantDto.id,
      };
      await this.assistantRepository.create(newAssistant);
      return assistantDto;
    } catch (err) {
      this.logger.error('assistantCreatedHandler error', {
        module: EventService.name,
        error: err,
      });
      throw err;
    }
  }
}
