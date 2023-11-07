import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AssistantDTO {
  @ApiProperty()
  @Expose()
  id: string;

  //specify which's device request
  @ApiProperty()
  @Expose()
  deviceToken: string;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

}
