import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetReport {
  @ApiProperty()
  file: Buffer;
}
