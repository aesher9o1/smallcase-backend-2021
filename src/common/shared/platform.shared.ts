import _ from 'lodash'
import { ServiceResponse } from '@common/models/response'
import { HttpStatus } from '@nestjs/common'
import { HttpMessages } from './messages.shared'

export function serverError(data) {
  console.log(data)
  return <ServiceResponse>{
    code: HttpMessages.INTERNAL_SERVER_ERROR.code,
    message: HttpMessages.INTERNAL_SERVER_ERROR.message,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    data
  }
}

export function serverOK(data?: unknown) {
  return <ServiceResponse>{
    code: HttpMessages.OK.code,
    message: HttpMessages.OK.message,
    status: HttpStatus.OK,
    data
  }
}
