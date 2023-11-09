import { Injectable } from '@nestjs/common';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { AmqpConnection, Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  MESSAGE_TYPE_RESPONSE_ID,
  RABBITMQ_ASSISTANT_CREATE_ROUTING,
  RABBITMQ_MESSAGE_CREATE_ROUTING,
  WELCOME_MESSAGE,
} from '@assistant-chat/constants';
import { AssistantDTO, MessageDTO } from '@assistant-chat/dtos';
import { AssistantRepository } from '../repositories/assistant.repository';
import { Assistant } from '../schemas/assistant.schema';
import { ConfigService } from '@nestjs/config';
import { Message } from '../schemas/message.schema';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class EventService {
  constructor(
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
    private readonly messageRepository: MessageRepository,
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
      var newAssistant = new Assistant(assistantDto.id);
      await this.assistantRepository.create(newAssistant);
      const welcomeMessage: Message = new Message(
        assistantDto.id,
        MESSAGE_TYPE_RESPONSE_ID,
        WELCOME_MESSAGE,
        false,
        null
      );
      await this.messageRepository.create(welcomeMessage);
      return assistantDto;
    } catch (err) {
      this.logger.error('assistantCreatedHandler error', {
        module: EventService.name,
        error: err,
      });
      //return nack to rabbitmq, requeue the message
      return new Nack(true);
    }
  }

  async publishMeesageCreatedEvent(message: MessageDTO) {
    try {
      await this.amqpConnection.publish(
        this.configService.get<string>('rabbitmq.exchangeName'),
        RABBITMQ_MESSAGE_CREATE_ROUTING,
        message
      );
      this.logger.info('publishMeesageCreatedEvent sent to rabitmq', {
        module: EventService.name,
        payload: message,
      });
    } catch (error) {
      this.logger.error('publishMeesageCreatedEvent error', {
        module: EventService.name,
        error: error,
      });
    }
  }
}
