import { Test, TestingModule } from '@nestjs/testing';
import { AssistantRepository } from './assistant.repository';
import { DataSource } from 'typeorm';
import { Assistant } from '../entities/assistant.entity';
import { NotFoundException } from '@nestjs/common/exceptions';

describe('AssistantRepository', () => {
  let repository: AssistantRepository;
  let dataSource: {
    createEntityManager: jest.Mock;
  };
  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<AssistantRepository>(AssistantRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get assistant by id', () => {
    const currentDate = new Date();
    const id = 'some_uuid';

    const expectedOutput: Assistant = {
      id,
      deviceToken: 'someToken',
      createdAt: currentDate,
      updatedAt: currentDate,

    };

    it('should call findOne with correct assistant id', () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return correct assistant data', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => expectedOutput);
      expect(await repository.getById(id)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when no assistant found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await repository.getById(id);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
