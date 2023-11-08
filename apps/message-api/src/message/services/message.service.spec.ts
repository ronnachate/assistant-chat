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
    countDocuments: jest.fn(),
    find: jest.fn(),
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

    //TODO: add more test cases, not enough time, will be added later
  });

  describe('getMessagesByAssistantID', () => {
    const message = {
      assistantID: '123',
      content: 'hello',
    };

    beforeEach(async () => {
      jest
        .spyOn(mockedMessageRepository, 'countDocuments')
        .mockImplementation(async () => 5);
      
      jest
        .spyOn(mockedMessageRepository, 'find')
        .mockImplementation(async () => [message]);
    });

    it('should return correct result', async () => {
      const { messages, count} = await service.getMessagesByAssistantID('123', 1, 10);
      expect(mockedMessageRepository.countDocuments).toHaveBeenCalled();
      expect(mockedMessageRepository.find).toHaveBeenCalled();
      
      expect(messages[0].content).toEqual(message.content);
      expect(messages[0].assistantID).toEqual(message.assistantID);

      expect(count).toEqual(5);
    });

    it('should return run correct filter', async () => {
      await service.getMessagesByAssistantID('123', 1, 10);
      expect(mockedMessageRepository.countDocuments).toHaveBeenCalledWith({ assistantID: '123' });
      expect(mockedMessageRepository.find).toHaveBeenCalledWith({ assistantID: '123'}, 0, 10 );
    });

    it('should thrown error when internal process failed', async () => {
      jest
        .spyOn(mockedMessageRepository, 'countDocuments')
        .mockRejectedValue(new BadRequestException());

      try {
        await service.newMessage({ assistantID: '123', content: 'hello' });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
