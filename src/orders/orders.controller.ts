import {Controller} from '@nestjs/common';
import {EventPattern, MessagePattern, Payload} from '@nestjs/microservices';
import {ChangeOrderStatusDto, CreateOrderDto, PaidOrderDto} from './dto';
import {OrdersService} from './orders.service';
import {PaginationDto} from '../common/dto';
import {OrderStatus} from "@prisma/client";

@Controller()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {
    }

    @MessagePattern('create_order')
    async create(@Payload() createOrderDto: CreateOrderDto) {
        const order = await this.ordersService.create(createOrderDto);

        const paymentSession = await this.ordersService.createPaymentSession(order);

        return {
            order,
            paymentSession,
        }
    }

    @MessagePattern('find_all_orders')
    findAll(@Payload() paginationDto: PaginationDto) {
        return this.ordersService.findAll(paginationDto);
    }

    @MessagePattern('find_one_order')
    async findOne(@Payload('id') id: string) {
        const order = await this.ordersService.findOne(id);

        let paymentSession = null;

        if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.CANCELLED) {
            paymentSession = await this.ordersService.createPaymentSession(order);
        }

        return {
            order,
            paymentSession,
        }
    }

    @MessagePattern('change_status_order')
    changeStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
        return this.ordersService.changeStatus(changeOrderStatusDto);
    }

    @EventPattern('payment.succeeded')
    markOrderAsPaid(@Payload() paidOrderDto: PaidOrderDto) {
        return this.ordersService.markOrderAsPaid(paidOrderDto);
    }
}
