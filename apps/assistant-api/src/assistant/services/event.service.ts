import { Injectable } from '@nestjs/common';
import { AssistantDTO, MessageDTO } from '@assistant-chat/dtos';
import { AmqpConnection, Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_ASSISTANT_CREATE_ROUTING, RABBITMQ_MESSAGE_CREATE_ROUTING } from '@assistant-chat/constants';
import { ConfigService } from '@nestjs/config';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { AssistantRepository } from '../repositories/assistant.repository';


@Injectable()
export class EventService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly configService: ConfigService,
    private readonly assistantRepository: AssistantRepository,
    private readonly logger: SeqLogger
  ) {}

  async publishAssistantCreatedEvent(assistant: AssistantDTO) {
    try {
      await this.amqpConnection.publish(
        this.configService.get<string>('rabbitmq.exchangeName'),
        RABBITMQ_ASSISTANT_CREATE_ROUTING,
        assistant
      );
      this.logger.info('publishMeesageCreatedEvent sent to rabitmq', {
        module: EventService.name,
        payload: assistant,
      });
    } catch (error) {
      this.logger.error('publishAssistantCreatedEvent error', {
        module: EventService.name,
        error: error,
      });
    }
  }

  @RabbitRPC({
    exchange: process.env.RABBITMQ_EXCHANGE_NAME,
    routingKey: RABBITMQ_MESSAGE_CREATE_ROUTING,
  })
  public async messageCreatedHandler(messageDto: MessageDTO) {
    try {
      this.logger.info('messageCreatedHandler recieved', { messageDto });
      //update assistant updated date
      const assistant = await this.assistantRepository.findOne({ where: { id: messageDto.assistantID } });
      assistant.updatedAt = new Date();
      await this.assistantRepository.save(assistant);
      return messageDto;
    } catch (err) {
      this.logger.error('messageCreatedHandler error', {
        module: EventService.name,
        error: err,
      });
      //return nack to rabbitmq, requeue the message
      return new Nack(true);
    }
  }
}
