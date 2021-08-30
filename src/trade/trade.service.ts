import { Injectable } from '@nestjs/common'
import { serverError, serverOK } from '@shared/platform.shared'
import { Types } from 'mongoose'
import { SecurityDTO } from './dto/security.dto'
import { TradeDTO } from './dto/trade.dto'
import { UpdateTradeDTO } from './dto/updateTrade.dto'
import { TradeDBService } from './trade.db.service'

@Injectable()
export class TradeService {
  constructor(private readonly dbService: TradeDBService) {}

  async addSecurity({ tickerSymbol }: SecurityDTO) {
    try {
      await this.dbService.upsertSecurity({ tickerSymbol })
      return serverOK()
    } catch (e) {
      return serverError(e)
    }
  }

  async getPortfolio() {
    try {
      return serverOK(await this.dbService.getPortfolio(true))
    } catch (e) {
      return serverError(e)
    }
  }

  async getAllSecurity() {
    try {
      return serverOK(await this.dbService.getAllSecurity())
    } catch (e) {
      return serverError(e)
    }
  }

  async addTrade(data: TradeDTO) {
    try {
      await this.dbService.tradeWithTransaction(data)

      return serverOK()
    } catch (e) {
      return serverError(e)
    }
  }

  async getAllTrade() {
    try {
      return serverOK(await this.dbService.getAllTrades())
    } catch (e) {
      return serverError(e)
    }
  }

  async getReturns() {
    try {
      /**
       * @TODO get the current price from API
       */
      const CURRENT_PRICE = 100

      const securities = await this.dbService.getPortfolio()
      let currentReturns = 0

      securities.forEach((security) => (currentReturns += (CURRENT_PRICE - security.averagePrice) * security.shares))
      return serverOK(currentReturns)
    } catch (e) {
      return serverError(e)
    }
  }

  async updateTrade(data: UpdateTradeDTO) {
    try {
      const trade = await this.dbService.getTrade(data.tradeID)
      if (!trade) return serverError({ message: 'trade not found' })

      const isSameSecurity = Types.ObjectId(data.securityID) === trade.securityID
      const isRemoval = data.shares == 0

      this.dbService.tradeWithTransaction(
        {
          shares: isRemoval ? trade.shares : data.shares,
          price: data.price,
          securityID: isRemoval ? (trade.securityID as unknown as string) : data.securityID
        },
        { tradeID: data.tradeID, extractSharesFromSecurityID: isSameSecurity ? undefined : trade.securityID, isRemoval }
      )

      return serverOK()
    } catch (e) {
      return serverError(e)
    }
  }
}
