import { BasePaginationParams } from '@assistant-chat/pagination';
import {IsOptional, IsString, Min } from 'class-validator';

export class MessagePaginationParams extends BasePaginationParams {

    @IsString()
    @IsOptional()
    assistantID: string;
}
