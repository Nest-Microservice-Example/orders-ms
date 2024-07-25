import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ChangeOrderStatusDto, CreateOrderDto } from './dto';
import { OrdersService } from './orders.service';
import { PaginationDto } from '../common/dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('find_all_orders')
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @MessagePattern('find_one_order')
  findOne(@Payload('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('change_status_order')
  changeStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.changeStatus(changeOrderStatusDto);
  }
}
