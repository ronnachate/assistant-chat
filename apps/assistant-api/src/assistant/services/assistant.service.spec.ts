import { Test, TestingModule } from '@nestjs/testing';
import { AssistantService } from './assistant.service';
import { AssistantRepository } from '../repositories/assistant.repository';
import { NotFoundException } from '@nestjs/common';
import { Equal, Not } from 'typeorm';
import e from 'express';
import { CreateAssistantDTO } from '@assistant-chat/dtos';

describe('AssistantService', () => {
  let service: AssistantService;

  const mockedRepository = {
    getById: jest.fn(),
    findAndCount: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const assistant3 = {
    id: 'uuid3',
    deviceToken: 'assistant3',
  };

  const assistant4 = {
    id: 'uuid4',
    deviceToken: 'assistant4',
  };

  beforeEach(async () => {
    const mockedLogger = { setContext: jest.fn(), log: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantService,
        {
          provide: AssistantRepository,
          useValue: mockedRepository,
        }
      ],
    }).compile();

    service = module.get<AssistantService>(AssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAssistants', () => {
    const page = 1;
    const rows = 10;
    mockedRepository.findAndCount.mockResolvedValue([[assistant3, assistant4], 2]);
    it('should return assistants as a list', async () => {
      await service.getAssistants(page, rows);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });

    it('should filtering by corect page and offset', async () => {
      await service.getAssistants(page, rows);
      let offset = (page - 1) * rows;
      let expectedFilter = {
        where: {},
        take: rows,
        skip: offset,
      };
      expect(mockedRepository.findAndCount).toHaveBeenCalledWith(
        expectedFilter
      );
    });
  });

  describe('getAssistantById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'getById')
        .mockImplementation(async () => assistant4);
    });

    it('should return correct assistant using given assistant id', async () => {
      await service.getAssistantById(assistant4.id);
      expect(mockedRepository.getById).toBeCalledWith(assistant4.id);
    });

    it('should return correct assistant assistant data using given assistant id', async () => {
      const result = await service.getAssistantById(assistant4.id);

      expect(result).toEqual({
        id: assistant4.id,
        deviceToken: assistant4.deviceToken,
      });
    });

    it('throw not found exception if no assistant with given id found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.getAssistantById('some_uuid');
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('newAssistant', () => {
    it('should return correct assistant with id and default status', async () => {
      jest.spyOn(mockedRepository, 'save').mockImplementation(async (input) => {
        input.id = 5;
        return input;
      });

      const assistantInput: CreateAssistantDTO = {
        deviceToken: 'someToken',
      };

      const result = await service.newAssistant(assistantInput);

      expect(result.id).toEqual(5);
      expect(result.deviceToken).toEqual(assistantInput.deviceToken);
    });
  });
});
