import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { PrismaService } from './prisma/prisma.service'

@Controller('/api')
export class AppController {
  constructor(
    private appService: AppService,
    private prisma: PrismaService
  ) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/users')
  async getUsers() {
    return await this.prisma.user.findMany()
  }
}
