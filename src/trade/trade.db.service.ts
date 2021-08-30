import { ISecurityCollection, SecurityCollection, TradeCollection } from '@common/schema'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { TradeDTO } from './dto/trade.dto'

@Injectable()
export class TradeDBService {
  constructor(@InjectModel(TradeCollection.name) private readonly tradeCollection: Model<TradeCollection>, @InjectModel(SecurityCollection.name) private readonly securityCollection: Model<SecurityCollection>) {}

  upsertSecurity(data: ISecurityCollection) {
    return this.securityCollection.updateOne({ tickerSymbol: data.tickerSymbol }, { ...data, shares: 0 }, { upsert: true }).lean()
  }

  getAllSecurity() {
    return this.securityCollection.find().lean()
  }

  getPortfolio(withLookup: boolean = false, securityID: string | null = null) {
    const pipeline = []

    if (securityID) {
      pipeline.push({
        $match: {
          _id: { $eq: securityID }
        }
      })
    }

    // Stage 1: Multiply quantity and price for every obj
    pipeline.push({
      $project: {
        price: {
          $cond: { if: { $gte: ['$shares', 0] }, then: { $multiply: ['$shares', '$price'] }, else: 0 }
        },
        securityID: '$securityID',
        shares: {
          $cond: { if: { $gte: ['$shares', 0] }, then: '$shares', else: 0 }
        }
      }
    })

    // Stage 2: Sum all the price and quantity
    pipeline.push({
      $group: {
        _id: '$securityID',
        price: { $sum: '$price' },
        shares: { $sum: '$shares' }
      }
    })

    // Stage 3: Calculate AVG
    pipeline.push({
      $project: {
        avgPrice: { $divide: ['$price', '$shares'] }
      }
    })

    //State 4: if we want the security details too
    if (withLookup) {
      pipeline.push({
        $lookup: {
          from: 'securities',
          localField: '_id',
          foreignField: '_id',
          as: 'security'
        }
      })

      pipeline.push({ $unwind: { path: '$security' } })
    }

    return this.tradeCollection.aggregate(pipeline)
  }

  async getAllTrades(withJoin = true) {
    const baseTradeQuery = this.tradeCollection.find()

    if (withJoin) {
      return baseTradeQuery.populate('securityID').lean()
    }

    return baseTradeQuery.lean()
  }

  async getTrade(tradeID: string) {
    return this.tradeCollection.findOne({ _id: Types.ObjectId(tradeID) }).lean()
  }

  async calculateSharesForID(securityID: Types.ObjectId) {
    const data = await this.tradeCollection.aggregate([
      {
        $match: {
          securityID: Types.ObjectId(securityID.toHexString())
        }
      },
      {
        $group: {
          _id: '$securityID',
          shares: { $sum: '$shares' }
        }
      }
    ])

    return data[0]?.shares || 0
  }

  async tradeWithTransaction(data: TradeDTO, updates?: { tradeID: string; extractSharesFromSecurityID?: Types.ObjectId; isRemoval?: boolean }) {
    const session = await this.securityCollection.db.startSession()
    session.startTransaction()

    try {
      const isBuy = data.shares > 0
      const security = await this.securityCollection
        .findOne({ _id: Types.ObjectId(data.securityID) })
        .session(session)
        .lean()
      if (!security) {
        throw 'No security exists with the ID'
      }

      const updatedShares = updates?.isRemoval ? data.shares - security.shares : data.shares + security.shares

      if (!isBuy && updatedShares < 0) {
        throw 'Not enough shares'
      }

      if (!updates?.tradeID) {
        await new this.tradeCollection({ shares: data.shares, securityID: Types.ObjectId(data.securityID), price: data.price }).save({ session })
      } else {
        if (updates?.isRemoval) {
          await this.tradeCollection.remove({ _id: Types.ObjectId(updates.tradeID) }).session(session)
        } else {
          await this.tradeCollection.updateOne({ _id: Types.ObjectId(updates.tradeID) }, { shares: data.shares, securityID: Types.ObjectId(data.securityID), price: data.price }).session(session)
        }
      }

      await this.securityCollection
        .updateOne(
          { _id: Types.ObjectId(data.securityID) },
          {
            shares: updatedShares
          }
        )
        .session(session)

      session.commitTransaction()

      if (Types.ObjectId(data.securityID) !== Types.ObjectId(updates?.extractSharesFromSecurityID as unknown as string) && data.shares !== 0) {
        const extractedShares = await this.calculateSharesForID(Types.ObjectId(updates?.extractSharesFromSecurityID as unknown as string))

        await this.securityCollection.updateOne({ _id: Types.ObjectId(updates?.extractSharesFromSecurityID as unknown as string) }, { shares: extractedShares })
      }
    } catch (e) {
      session.abortTransaction()
      throw e
    }
  }
}
