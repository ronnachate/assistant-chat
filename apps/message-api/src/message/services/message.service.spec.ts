import { Test, TestingModule } from '@nestjs/testing';

import { MessageService } from './message.service';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { ConfigService } from '@nestjs/config';
import { OpenaiService } from './openai.service';
import { MessageRepository } from '../repositories/message.repository';
import { AssistantRepository } from '../../assistant/repositories/assistant.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OpenaiService', () => {
  let service: MessageService;

  const mockedLogger = {
    error: jest.fn(),
    info: jest.fn(),
  };

  const mockedMessageRepository = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    create: jest.fn(),
  };

  const mockedAssistantRepository = {
    findOne: jest.fn(),
  };

  const mockedOpenaiService = {
    ask: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: OpenaiService,
          useValue: mockedOpenaiService,
        },
        {
          provide: MessageRepository,
          useValue: mockedMessageRepository,
        },
        {
          provide: AssistantRepository,
          useValue: mockedAssistantRepository,
        },
        { provide: SeqLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('newMessage', () => {
    it('should thrown error when assistan found', async () => {
      jest
        .spyOn(mockedAssistantRepository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.newMessage({ assistantID: '123', content: 'hello' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
