import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDTO {
  @ApiProperty()
  @Expose()
  assistantID: string;

  @ApiProperty()
  @Expose()
  typeID: number;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: string;
}
