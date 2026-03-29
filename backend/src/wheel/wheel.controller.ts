import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WheelService } from './wheel.service';
import { CreateWheelDto } from './dto/create-wheel.dto';
import { Wheel, WheelStatus } from './entities/wheel.entity';

@Controller('wheels')
export class WheelController {
  constructor(private readonly wheelService: WheelService) { }

  @Post()
  create(@Body() dto: CreateWheelDto) {
    return this.wheelService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: WheelStatus,
    @Query('sortBy') sortBy: keyof Wheel = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC'
  ) {
    return this.wheelService.findAll({ page, limit, status, sortBy, order });
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.wheelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: CreateWheelDto) {
    return this.wheelService.update(id, dto);
  }
}