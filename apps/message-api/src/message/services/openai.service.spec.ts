import { Test, TestingModule } from '@nestjs/testing';

import { OpenaiService } from './openai.service'
import { SeqLogger } from '@jasonsoft/nestjs-seq';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

describe('OpenaiService', () => {
  let service: OpenaiService;

  const mockedLogger = {
    error: jest.fn(),
  };

  const mockedConfig = {
    get: jest.fn(),
  };


  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        OpenaiService,
        {
          provide: ConfigService,
          useValue: mockedConfig,
        },
        { provide: SeqLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<OpenaiService>(OpenaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ask', () => {
    it('should return serialized user', async () => {
      const result = await service.ask('hello');
      expect(result).toBeDefined();
    });
  });
});
