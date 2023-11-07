import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeqLogger } from '@jasonsoft/nestjs-seq';

import { AssistantService } from '../services/assistant.service';
import {
  AssistantDTO,
  CreateAssistantDTO,
} from '@assistant-chat/dtos';
import { AssistantPaginationParams } from '../query-params/pagination-params';
import { PaginationResultset } from '@assistant-chat/pagination';
import { INTERNAL_SERVER_ERROR_MSG } from '@assistant-chat/constants';

@ApiTags('assistants')
@Controller('v1/assistants')
@UseInterceptors(ClassSerializerInterceptor)
export class AssistantController {
  constructor(
    private readonly assistantService: AssistantService,
    private readonly logger: SeqLogger
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get assistants with pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginationResultset<AssistantDTO[]>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  async getAssistants(
    @Query() query: AssistantPaginationParams
  ): Promise<PaginationResultset<AssistantDTO[]>> {
    try {
      const { page = 1, rows = 10 } = query;
      const { assistants, count } = await this.assistantService.getAssistants(
        page,
        rows
      );

      return { items: assistants, pagination: { page, rows, count } };
    } catch (error) {
      this.logger.error('getAssistants error', {
        module: AssistantController.name,
        query: query,
        error: error,
      });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: INTERNAL_SERVER_ERROR_MSG,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        }
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get assistant by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AssistantDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  async getAssistant(@Param('id') id: string): Promise<AssistantDTO> {
    try {
      const assistant = await this.assistantService.getAssistantById(id);
      return assistant;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          }
        );
      } else {
        this.logger.error(`getAssistant with id error id: "${id}"`, {
          module: AssistantController.name,
          error: error,
        });
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: INTERNAL_SERVER_ERROR_MSG,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: error,
          }
        );
      }
    }
  }

  @Post()
  @ApiOperation({
    summary: 'Create new assistant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AssistantDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  async createAssistant(
    @Body() input: CreateAssistantDTO
  ): Promise<AssistantDTO> {
    try {
      const assistant = await this.assistantService.newAssistant(input);
      return assistant;
    } catch (error) {
      this.logger.error('new assistant erro', {
        module: AssistantController.name,
        input: input,
        error: error,
      });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: INTERNAL_SERVER_ERROR_MSG,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        }
      );
    }
  }
}
