import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { INTERNAL_SERVER_ERROR_MSG } from '@assistant-chat/constants'
import { CreateAssistantDTO } from '@assistant-chat/assistant-dto';
import { AssistantController } from './assistant.controller';
import { AssistantService } from '../services/assistant.service';
import { AssistantPaginationParams } from '../query-params/pagination-params';

describe('AssistantController', () => {
  let controller: AssistantController;
  const mockedAssistantService = {
    getAssistants: jest.fn(),
    getAssistantById: jest.fn(),
    newAssistant: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), error: jest.fn() };

  const currentDate = new Date();
  const assistant3 = {
    id: 'uuid3',
    deviceToken: 'token3',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
  };

  const assistant4 = {
    id: 'uuid4',
    deviceToken: 'token4',
    createdAt: currentDate.toISOString(),
    updatedAt: currentDate.toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssistantController],
      providers: [
        { provide: AssistantService, useValue: mockedAssistantService },
        { provide: SeqLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = module.get<AssistantController>(AssistantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Assistants as a list', () => {
    const page = 1;
    const rows = 10;
    const resultCount = 2;
    const query: AssistantPaginationParams = {
      page: page,
      rows: rows,
    };

    it('should call getAssistants function', () => {
      mockedAssistantService.getAssistants.mockResolvedValue({ assistants: [], count: 0 });
      controller.getAssistants(query);
      expect(mockedAssistantService.getAssistants).toHaveBeenCalled();
    });

    it('should return correct result', async () => {
      const pagination = { page: page, rows: rows, count: resultCount };
      mockedAssistantService.getAssistants.mockResolvedValue({
        assistants: [assistant3, assistant4],
        count: resultCount,
      });
      var result = await controller.getAssistants(query);
      expect(result.items).toEqual([assistant3, assistant4]);
      expect(result.pagination).toEqual(pagination);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedAssistantService.getAssistants.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getAssistants(query);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });

  describe('Get assistant by id', () => {
    it('should return correct assistant', async () => {
      mockedAssistantService.getAssistantById.mockResolvedValue(assistant3);

      expect(await controller.getAssistant(assistant3.id)).toEqual(assistant3);
      expect(mockedAssistantService.getAssistantById).toHaveBeenCalledWith(assistant3.id);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedAssistantService.getAssistantById.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getAssistant('some_uuid');
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });

    it('should thrown error 404 when service thrown NotFoundException', async () => {
      mockedAssistantService.getAssistantById.mockRejectedValue(
        new NotFoundException()
      );
      try {
        await controller.getAssistant('some_uuid');
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(404);
      }
    });
  });

  describe('Create assistant', () => {
    const input = new CreateAssistantDTO();
    it('Create assistant should return corect assistant', async () => {
      const assistantDto = {
        name: 'assistant5',
        deviceToken: 'toke5',
      };
      mockedAssistantService.newAssistant.mockResolvedValue(assistantDto);

      expect(await controller.createAssistant(input)).toEqual(assistantDto);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedAssistantService.newAssistant.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.createAssistant(input);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });
});
