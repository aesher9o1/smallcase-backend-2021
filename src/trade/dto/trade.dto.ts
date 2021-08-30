import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNumber } from 'class-validator'

export class TradeDTO {
  @ApiProperty({
    description: 'The id of the secruity we are targetting'
  })
  @IsMongoId()
  securityID: string

  @ApiProperty({
    description: 'Number of shares we want to trade. This can be positive to buy and negative for sell'
  })
  @IsNumber()
  shares: number

  @ApiProperty({
    description: 'Price at which the trade was done'
  })
  @IsNumber()
  price: number
}
