import { Controller, Get } from '@nestjs/common'
import type { AppService } from './app.service'

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }
}
