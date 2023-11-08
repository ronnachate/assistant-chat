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

import { MessageService } from '../services/message.service';
import { MessageDTO, NewMessageDTO } from '@assistant-chat/dtos';
import { MessagePaginationParams } from '../query-params/pagination-params';
import { PaginationResultset } from '@assistant-chat/pagination';
import { INTERNAL_SERVER_ERROR_MSG } from '@assistant-chat/constants';

@ApiTags('messages')
@Controller('v1/messages')
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly logger: SeqLogger
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get assistants with pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginationResultset<MessageDTO[]>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  async getMessages(
    @Query() query: MessagePaginationParams
  ): Promise<PaginationResultset<MessageDTO[]>> {
    try {
      const { page = 1, rows = 10 } = query;
      const { messages, count } = await this.messageService.getMessages(
        query.assistantID,
        page,
        rows
      );

      return { items: messages, pagination: { page, rows, count } };
    } catch (error) {
      this.logger.error('getMessages error', {
        module: MessageController.name,
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

  @Post()
  @ApiOperation({
    summary: 'Create new assistant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  async createMessage(@Body() input: NewMessageDTO): Promise<MessageDTO> {
    try {
      const responseMessage = await this.messageService.newMessage(input);
      return responseMessage;
    } catch (error) {
      this.logger.error('new message erro', {
        module: MessageController.name,
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
