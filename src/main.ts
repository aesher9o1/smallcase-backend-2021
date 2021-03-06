import dotenv from 'dotenv'
dotenv.config()

import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import _ from 'lodash'
import { AppModule } from './app/app.module'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { QuillFastifyAdapter } from '@shared/fastify.shared'
import { ValidationPipe } from '@nestjs/common'

const bootstrap = () => {
  return new Promise<boolean>((resolve, reject) => {
    NestFactory.create<NestFastifyApplication>(AppModule, new QuillFastifyAdapter().get())
      .then((app) => {
        app.setGlobalPrefix('/api')
        app.enableCors()
        app.useGlobalPipes(
          new ValidationPipe({
            transform: true
          })
        )

        const swaggerConfig = new DocumentBuilder().setTitle('Smallcase Demo').setDescription('Demo Task for smallcase').build()
        const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig)
        SwaggerModule.setup('api/system/docs', app, swaggerDoc)

        app.listen(process.env.PORT || 3001, '0.0.0.0').then(() => {
          app
            .getUrl()
            .then((url: string) => resolve(true))
            .catch((error: Error) => {
              reject()
              process.exit(0)
            })
        })
      })
      .catch((error: Error) => {
        reject()
        process.exit(0)
      })
  })
}

bootstrap()
