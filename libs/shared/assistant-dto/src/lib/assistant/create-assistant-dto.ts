import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty} from 'class-validator';

export class CreateAssistantDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deviceToken: string;

}
