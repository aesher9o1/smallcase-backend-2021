import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { MongooseHandlerModule } from '@common/modules/mongoose.module'
import { ApplicationController } from './app.controller'
import { TradeModule } from 'src/trade/trade.module'

@Module({
  imports: [MongooseHandlerModule, TradeModule],
  controllers: [ApplicationController],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }]
})
export class AppModule {}
