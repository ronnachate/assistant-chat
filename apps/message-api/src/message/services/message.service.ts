import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { NewMessageDTO } from '@assistant-chat/dtos';
import { MESSAGE_TYPE_RESPONSE_ID, MESSAGE_TYPE_REUQEST_ID, UNKNOWN_RESPONSE } from '@assistant-chat/constants';
import { MessageRepository } from '../repositories/message.repository';
import { AssistantRepository } from '../../assistant/repositories/assistant.repository';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly assistantRepository: AssistantRepository
  ) {}

  async newMessage(request: NewMessageDTO) {
    const assistant = await this.assistantRepository.findOne({
      assistantID: request.assistantID,
    });

    if (!assistant) {
      throw new BadRequestException('Invalid Assitant ID');
    }

    let newMessage: Message = plainToInstance(Message, request);
    newMessage.typeID = MESSAGE_TYPE_REUQEST_ID;
    const message = await this.storeNewMessage(newMessage);

    try {
      //connect to gpt
      await this.connectToGPT();

      return message;
    } catch (err) {
      //connect to gpt failed, return default message
      let newMessage: Message = plainToInstance(Message, {
        isGptResponse: false,
        typeID: MESSAGE_TYPE_RESPONSE_ID,
        content: UNKNOWN_RESPONSE,
      });
      const message = await this.storeNewMessage(newMessage);
    }
  }

  async getMessageByAssistantID() {
    return this.messageRepository.find({});
  }

  async connectToGPT() {
    //connect to gpt
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
      await session.abortTransaction();
      throw err;
    }
  }
}
