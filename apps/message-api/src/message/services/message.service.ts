import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MessageDTO, NewMessageDTO } from '@assistant-chat/dtos';
import {
  MESSAGE_TYPE_RESPONSE_ID,
  MESSAGE_TYPE_REUQEST_ID,
  UNKNOWN_RESPONSE,
} from '@assistant-chat/constants';
import { MessageRepository } from '../repositories/message.repository';
import { AssistantRepository } from '../repositories/assistant.repository';
import { Message } from '../schemas/message.schema';
import { OpenaiService } from './openai.service';
import { SeqLogger } from '@jasonsoft/nestjs-seq';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly assistantRepository: AssistantRepository,
    private readonly openaiService: OpenaiService,
    private readonly logger: SeqLogger
  ) {}

  async newMessage(request: NewMessageDTO): Promise<MessageDTO> {
    const assistant = await this.assistantRepository.findOne({
      assistantID: request.assistantID,
    });

    if (!assistant) {
      throw new BadRequestException('Invalid Assitant ID');
    }

    let newMessage: Message = new Message(
      request.assistantID,
      MESSAGE_TYPE_REUQEST_ID,
      request.content,
      false,
      null
    );
    newMessage.typeID = MESSAGE_TYPE_REUQEST_ID;
    await this.messageRepository.create(newMessage);

    try {
      //connect to gpt
      var result = await this.openaiService.ask(newMessage.content);
      if (result.choices.length > 0) {
        const responseMessage: Message = new Message(
          request.assistantID,
          MESSAGE_TYPE_RESPONSE_ID,
          result.choices[0].message.content,
          true,
          JSON.stringify(result)
        );
        const message = await this.messageRepository.create(responseMessage);
        return plainToInstance(MessageDTO, message);
      } else {
        //no choice response from gpt, return default message
        this.logger.info('no response from openai, return default message', {
          module: MessageService.name,
          openapiResult: result,
        });

        const responseMessage: Message = new Message(
          request.assistantID,
          MESSAGE_TYPE_RESPONSE_ID,
          UNKNOWN_RESPONSE,
          false,
          JSON.stringify(result)
        );
        const message = await this.messageRepository.create(responseMessage);
        return plainToInstance(MessageDTO, message);
      }
    } catch (err) {
      //connect to gpt failed, return default message
      const responseMessage: Message = new Message(
        request.assistantID,
        MESSAGE_TYPE_RESPONSE_ID,
        UNKNOWN_RESPONSE,
        false,
        null
      );
      const message = await this.messageRepository.create(responseMessage);
      return plainToInstance(MessageDTO, message);
    }
  }

  async getMessages(
    assistantID: string | null,
    page: number,
    rows: number
  ): Promise<{ messages: MessageDTO[]; count: number }> {
    const offset = (page - 1) * rows;
    let filter = {};
    if (assistantID) {
      filter = { assistantID: assistantID };
    }
    const count = await this.messageRepository.countDocuments({
      assistantID: assistantID,
    });
    const messages = await this.messageRepository.find(filter, offset, rows);
    const messagesOutput = plainToInstance(MessageDTO, messages, {
      excludeExtraneousValues: true,
    });
    return { messages: messagesOutput, count };
  }
}
