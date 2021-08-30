import { FastifyAdapter } from '@nestjs/platform-fastify'
import { Logger } from '@nestjs/common'
import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { ServiceResponse } from '@common/models/response'
import _ from 'lodash'

interface FasifyResponse {
  statusCode: number
  message: string
  error: string
}
export class QuillFastifyAdapter {
  private fastifyInstance: FastifyInstance

  constructor() {
    this.fastifyInstance = fastify({
      trustProxy: 1,
      disableRequestLogging: true,
      logger: null
    })

    this.initSessionModule()
  }

  private initSessionModule() {
    this.fastifyInstance.register(require('fastify-swagger'))
  }

  public get() {
    this.preSerialization()
    this.onResponse()

    return new FastifyAdapter(this.fastifyInstance as any)
  }

  private preSerialization() {
    this.fastifyInstance.addHook('preSerialization', (request: FastifyRequest, reply, response: ServiceResponse, next) => {
      if (request.url.includes('/api/system/docs/')) {
        next(null, response)
        return
      }

      reply.code(response.status || (response as unknown as FasifyResponse).statusCode)

      next(null, {
        ...this.getMessageFromResponse(response),
        traceID: request.id
      })
    })
  }

  private onResponse() {
    this.fastifyInstance.addHook('onResponse', (request: FastifyRequest, reply, done) => {
      const userAgentSpecs = this.getBrowserAndVersion(<string>(request.headers['user-agent'] || request.headers['User-Agent']))

      Logger.debug({
        status: reply.statusCode,
        traceID: request.id,
        path: request.url,
        method: request.method,
        elapsedTime: reply.getResponseTime(),
        uid: request.id,
        ip: request.ip,
        browser: {
          name: userAgentSpecs[0],
          version: parseInt(userAgentSpecs[1], 10)
        }
      })
    })
  }

  private getBrowserAndVersion = (userAgent: string): RegExpMatchArray => {
    const unknown_browser = ['unknown', '00', '-?']
    if (userAgent) {
      let tem: RegExpMatchArray
      let M = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(userAgent) || []
        return ['IE', tem[1] || '']
      }
      if (M[1] === 'Chrome') {
        tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/)
        if (tem) return tem.slice(1).join(' ').replace('OPR', 'Opera').split(' ')
      }
      M = M[2] ? [M[1], M[2]] : unknown_browser
      if ((tem = userAgent.match(/version\/(\d+)/i))) M.splice(1, 1, tem[1])
      return M
    }
    return unknown_browser
  }

  private getMessageFromResponse(response: ServiceResponse) {
    return {
      data: response.data,
      message: response.message,
      status: response.status || (response as unknown as FasifyResponse).statusCode,
      code: response.code
    }
  }
}
