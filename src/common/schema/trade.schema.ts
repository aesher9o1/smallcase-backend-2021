import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { tables } from '@shared/config.shared'
import { Document, Types } from 'mongoose'
import { SecurityCollection } from './security.schema'

@Schema({ versionKey: false, collection: tables.TRADES, timestamps: true })
export class TradeCollection extends Document {
  @Prop({ type: Types.ObjectId, required: true, index: true, ref: SecurityCollection.name })
  securityID: Types.ObjectId

  @Prop({ type: Number, required: true })
  shares: number

  @Prop({ type: Number, required: true })
  price: number
}

export const TradeSchema = SchemaFactory.createForClass(TradeCollection)
export type ITradeCollection = Pick<TradeCollection, 'securityID' | 'shares' | 'price'>
