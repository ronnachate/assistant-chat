import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@assistant-chat/mongodb';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessageRepository extends AbstractRepository<Message> {
  protected readonly logger = new Logger(MessageRepository.name);

  constructor(
    @InjectModel(Message.name) messageModel: Model<Message>,
    @InjectConnection() connection: Connection,
  ) {
    super(messageModel, connection);
  }
}
