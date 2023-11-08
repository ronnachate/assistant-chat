import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { INTERNAL_SERVER_ERROR_MSG } from '@assistant-chat/constants';
import { NewMessageDTO } from '@assistant-chat/dtos';
import { MessageController } from './message.controller';
import { MessageService } from '../services/message.service';
import { MessagePaginationParams } from '../query-params/pagination-params';

describe('MessageController', () => {
  let controller: MessageController;
  const mockedMessageService = {
    getMessages: jest.fn(),
    getMessageById: jest.fn(),
    newMessage: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), error: jest.fn() };

  const currentDate = new Date();
  const message3 = {
    messageID: 'uuid3',
    content: 'content3',
    createdAt: currentDate.toISOString(),
  };

  const message4 = {
    messageID: 'uuid3',
    content: 'content4',
    createdAt: currentDate.toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        { provide: MessageService, useValue: mockedMessageService },
        { provide: SeqLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Messages as a list', () => {
    const page = 1;
    const rows = 10;
    const resultCount = 2;
    const assistantID = 'uuid3';
    const query: MessagePaginationParams = {
      assistantID: assistantID,
      page: page,
      rows: rows,
    };

    it('should call getMessages function', () => {
      mockedMessageService.getMessages.mockResolvedValue({
        messages: [],
        count: 0,
      });
      controller.getMessages(query);
      expect(mockedMessageService.getMessages).toHaveBeenCalled();
    });

    it('should return correct result', async () => {
      const pagination = { page: page, rows: rows, count: resultCount };
      mockedMessageService.getMessages.mockResolvedValue({
        messages: [message3, message4],
        count: resultCount,
      });
      var result = await controller.getMessages(query);
      expect(result.items).toEqual([message3, message4]);
      expect(result.pagination).toEqual(pagination);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedMessageService.getMessages.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.getMessages(query);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });

  describe('new message', () => {
    const input = new NewMessageDTO();
    it('Create message should return corect message', async () => {
      const messageDto = {
        name: 'message5',
        deviceToken: 'toke5',
      };
      mockedMessageService.newMessage.mockResolvedValue(messageDto);

      expect(await controller.createMessage(input)).toEqual(messageDto);
    });

    it('should thrown error with generic internal error msg', async () => {
      mockedMessageService.newMessage.mockRejectedValue(
        new InternalServerErrorException()
      );
      try {
        await controller.createMessage(input);
      } catch (error) {
        expect(error.constructor).toBe(HttpException);
        var errorResponse = error.response;
        expect(errorResponse.status).toEqual(500);
        expect(errorResponse.error).toEqual(INTERNAL_SERVER_ERROR_MSG);
      }
    });
  });
});
