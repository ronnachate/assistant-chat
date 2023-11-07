import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Assistant } from '../entities/assistant.entity';

@Injectable()
export class AssistantRepository extends Repository<Assistant> {
  constructor(private dataSource: DataSource) {
    super(Assistant, dataSource.createEntityManager());
  }

  async getById(id: string): Promise<Assistant> {
    const user = await this.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
