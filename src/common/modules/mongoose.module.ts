import { MongooseModule } from '@nestjs/mongoose'

export const MongooseHandlerModule = MongooseModule.forRoot(process.env.MONGO_URL, {
  useNewUrlParser: true,
  keepAlive: true,
  autoIndex: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
