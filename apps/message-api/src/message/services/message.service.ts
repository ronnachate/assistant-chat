import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MessageDTO, NewMessageDTO } from '@assistant-chat/dtos';
import {
  MESSAGE_TYPE_RESPONSE_ID,
  MESSAGE_TYPE_REUQEST_ID,
  UNKNOWN_RESPONSE,
} from '@assistant-chat/constants';
import { MessageRepository } from '../repositories/message.repository';
import { AssistantRepository } from '../../assistant/repositories/assistant.repository';
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

    let newMessage: Message = plainToInstance(Message, request);
    newMessage.typeID = MESSAGE_TYPE_REUQEST_ID;
    await this.storeNewMessage(newMessage);

    try {
      //connect to gpt
      var result = await this.openaiService.ask(newMessage.content);
      if (result.choices.length > 0) {
        let responseMessage: Message = plainToInstance(Message, {
          isGptResponse: true,
          typeID: MESSAGE_TYPE_RESPONSE_ID,
          content: result.choices[0].message.content,
        });
        const message = await this.storeNewMessage(responseMessage);
        return plainToInstance(MessageDTO, message);
      } else {
        //no choice response from gpt, return default message
        this.logger.info('no response from openai, return default message', {
          module: MessageService.name,
          openapiResult: result,
        });
        let responseMessage: Message = plainToInstance(Message, {
          isGptResponse: false,
          typeID: MESSAGE_TYPE_RESPONSE_ID,
          content: UNKNOWN_RESPONSE,
        });
        const message = await this.storeNewMessage(responseMessage);
        return plainToInstance(MessageDTO, message);
      }
    } catch (err) {
      //connect to gpt failed, return default message
      let responseMessage: Message = plainToInstance(Message, {
        isGptResponse: false,
        typeID: MESSAGE_TYPE_RESPONSE_ID,
        content: UNKNOWN_RESPONSE,
      });
      const message = await this.storeNewMessage(responseMessage);
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

  async storeNewMessage(newMessage: Message) {
    const session = await this.messageRepository.startTransaction();
    try {
      const message = await this.messageRepository.create(newMessage, {
        session,
      });
      await session.commitTransaction();
      return message;
    } catch (err) {
      this.logger.error('save to mongodb failed', {
        module: MessageService.name,
        error: err,
      });
      await session.abortTransaction();
      throw err;
    }
  }
}
