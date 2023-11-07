import { Injectable} from '@nestjs/common';
import { AssistantRepository } from '../repositories/assistant.repository';
import { plainToClass, plainToInstance } from 'class-transformer';

import { Equal, Not } from 'typeorm';
import { Assistant } from '../entities/assistant.entity';
import { AssistantDTO, CreateAssistantDTO } from '@assistant-chat/dtos';

const SALT_ROUNDS = 10;

@Injectable()
export class AssistantService {
  constructor(
    private repository: AssistantRepository
  ) {
  }

  async getAssistants(
    page: number,
    rows: number,
  ): Promise<{ assistants: AssistantDTO[]; count: number }> {
    let offset = (page - 1) * rows;
    let filters = {
      where: {},
      take: rows,
      skip: offset,
    };
    const [assistants, count] = await this.repository.findAndCount(filters);

    const assistantsOutput = plainToInstance(AssistantDTO, assistants, {
      excludeExtraneousValues: true,
    });

    return { assistants: assistantsOutput, count };
  }

  async getAssistantById(id: string): Promise<AssistantDTO> {
    const assistant = await this.repository.getById(id);

    return plainToInstance(AssistantDTO, assistant, {
      excludeExtraneousValues: true,
    });
  }

  async newAssistant(
    input: CreateAssistantDTO,
  ): Promise<AssistantDTO> {

    let assistant: Assistant = plainToClass(Assistant, input);
    await this.repository.save(assistant);

    return plainToClass(AssistantDTO, assistant, {
      excludeExtraneousValues: true,
    });
  }

}
