import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@assistant-chat/mongodb';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Assistant } from '../schemas/assistant.schema';

@Injectable()
export class AssistantRepository extends AbstractRepository<Assistant> {
  protected readonly logger = new Logger(AssistantRepository.name);

  constructor(
    @InjectModel(Assistant.name) assistantModel: Model<Assistant>,
    @InjectConnection() connection: Connection,
  ) {
    super(assistantModel, connection);
  }
}
