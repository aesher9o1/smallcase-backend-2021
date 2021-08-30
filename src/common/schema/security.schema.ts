import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { tables } from '@shared/config.shared'
import { Document } from 'mongoose'

@Schema({ versionKey: false, collection: tables.SECURITIES })
export class SecurityCollection extends Document {
  @Prop({ type: String, required: true, index: true, unique: true })
  tickerSymbol: string

  @Prop({ type: Number, default: 0 })
  shares: number
}

export const SecuritySchema = SchemaFactory.createForClass(SecurityCollection)
export type ISecurityCollection = Pick<SecurityCollection, 'tickerSymbol'>
