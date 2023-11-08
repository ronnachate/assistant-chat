import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantController } from './controllers/assistant.controller';
import { AssistantService } from './services/assistant.service';
import { AssistantRepository } from './repositories/assistant.repository';
import { Assistant } from './entities/assistant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assistant])],
  controllers: [AssistantController],
  providers: [AssistantService, AssistantRepository],
  exports: [AssistantService],
})
export class AssistantModule {}
