import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsNumber } from 'class-validator'
import { TradeDTO } from './trade.dto'

export class UpdateTradeDTO extends TradeDTO {
  @ApiProperty({
    description: 'Trade id to update'
  })
  @IsMongoId()
  tradeID: string
}
