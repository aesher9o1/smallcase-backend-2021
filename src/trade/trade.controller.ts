import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { SecurityDTO } from './dto/security.dto'
import { TradeDTO } from './dto/trade.dto'
import { UpdateTradeDTO } from './dto/updateTrade.dto'
import { TradeService } from './trade.service'

@Controller('trade')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @ApiOperation({ summary: 'Buy or sell a trade' })
  @Post('add-trade')
  addTrade(@Body() data: TradeDTO) {
    return this.tradeService.addTrade(data)
  }

  @ApiOperation({ summary: 'Update any trade' })
  @Post('update-trade')
  updateTrade(@Body() data: UpdateTradeDTO) {
    return this.tradeService.updateTrade(data)
  }

  @ApiOperation({ summary: 'Get a list of all trade done' })
  @Get('trades')
  getTrades() {
    return this.tradeService.getAllTrade()
  }

  @ApiOperation({ summary: 'Demo route to populate the db' })
  @Post('add-security')
  addSecurity(@Body() data: SecurityDTO) {
    return this.tradeService.addSecurity(data)
  }

  @ApiOperation({ summary: 'Get the protfolio for the user' })
  @Get('securities')
  getSecurities() {
    return this.tradeService.getAllSecurity()
  }

  @ApiOperation({ summary: 'Get the protfolio for the user' })
  @Get('portfolio')
  getPortfolio() {
    return this.tradeService.getPortfolio()
  }

  @ApiOperation({ summary: 'Caluclate overall return for the trade' })
  @Get('returns')
  getReturns() {
    return this.tradeService.getReturns()
  }
}
