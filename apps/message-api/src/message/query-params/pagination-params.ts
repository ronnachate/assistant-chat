import { BasePaginationParams } from '@assistant-chat/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Min } from 'class-validator';

export class MessagePaginationParams extends BasePaginationParams {
  @ApiPropertyOptional({
    description: ' filter with assistantID, optional',
    type: String,
  })
  @IsString()
  @IsOptional()
  assistantID: string;
}
