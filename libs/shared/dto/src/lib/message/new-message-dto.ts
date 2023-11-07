import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty} from 'class-validator';

export class NewMessageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  assistantID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

}
