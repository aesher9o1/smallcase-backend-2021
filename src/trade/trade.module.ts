import { TradeCollection, TradeSchema, SecurityCollection, SecuritySchema } from '@common/schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TradeController } from './trade.controller'
import { TradeDBService } from './trade.db.service'
import { TradeService } from './trade.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradeCollection.name, schema: TradeSchema },
      { name: SecurityCollection.name, schema: SecuritySchema }
    ])
  ],
  providers: [TradeService, TradeDBService],
  controllers: [TradeController],
  exports: []
})
export class TradeModule {}
