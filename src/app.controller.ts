import { Body, Controller, Get, Post, Render, Session  } from '@nestjs/common';
import { AppService } from './app.service.js';
import { FormDTO } from './form.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getIndex() {
    return {
      title: 'Szállásfoglalás beadandó',
      error: null,
      count: await this.appService.getCount()
    }
  }

  @Post()
  @Render('index')
  async postIndex(@Body() body: FormDTO) {
    const result = await this.appService.postNew(body);
    return {
      title: 'Szállásfoglalás beadandó',
      error: result?.error || null,
      count: await this.appService.getCount()
    }
  }
}
