import { Controller, Get, HttpStatus } from '@nestjs/common'
import { ApiExcludeController, ApiTags } from '@nestjs/swagger'
import { ServiceResponse } from '@common/models/response'
import { HttpMessages } from '@shared/messages.shared'

@ApiTags('Base')
@ApiExcludeController()
@Controller()
export class ApplicationController {
  constructor() {}

  @Get()
  baseRoute() {
    return <ServiceResponse>{
      message: HttpMessages.OK.message,
      code: HttpMessages.OK.code,
      status: HttpStatus.OK,
      data: { message: 'welcome to smallcase api' }
    }
  }

  @Get('/favicon.ico')
  favicon() {
    return <ServiceResponse>{
      message: HttpMessages.NOT_FOUND.message,
      code: HttpMessages.NOT_FOUND.code,
      status: HttpStatus.NO_CONTENT,
      data: {}
    }
  }
}
