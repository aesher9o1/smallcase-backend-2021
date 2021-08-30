import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class SecurityDTO {
  @ApiProperty({
    description: 'Unique ticker ID'
  })
  @IsString()
  tickerSymbol: string
}
