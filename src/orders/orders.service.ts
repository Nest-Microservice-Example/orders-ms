import {HttpStatus, Inject, Injectable, Logger, OnModuleInit,} from '@nestjs/common';
import {ChangeOrderStatusDto, CreateOrderDto} from './dto';
import {PrismaClient} from '@prisma/client';
import {PaginationDto} from '../common/dto';
import {ClientProxy, RpcException} from '@nestjs/microservices';
import {NATS_SERVICE} from '../config';
import {firstValueFrom} from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(OrdersService.name);

    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async create(createOrderDto: CreateOrderDto) {
        try {
            const productIds = createOrderDto.items.map((item) => item.productId);

            const products: any[] = await firstValueFrom(
                this.client.send('validate_products', productIds),
            );

            const totalAmount = createOrderDto.items.reduce((acc, item) => {
                const product = products.find(
                    (product) => product.id === item.productId,
                );

                const amount = product.price * item.quantity;

                return acc + amount;
            }, 0);

            const totalItems = createOrderDto.items.reduce((acc, item) => {
                return acc + item.quantity;
            }, 0);

            const items = createOrderDto.items.map((item) => {
                const product = products.find(
                    (product) => product.id === item.productId,
                );

                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                };
            });

            const order = await this.order.create({
                data: {
                    totalAmount,
                    totalItems,
                    items: {
                        createMany: {
                            data: items,
                        },
                    },
                },
                include: {
                    items: {
                        select: {
                            quantity: true,
                            productId: true,
                            price: true,
                        },
                    },
                },
            });

            return {
                ...order,
                items: order.items.map((item) => {
                    const product = products.find(
                        (product) => product.id === item.productId,
                    );

                    return {
                        ...item,
                        name: product.name,
                    };
                }),
            };
        } catch (e) {
            this.logger.error(e?.message || e);

            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: `Check Logs`,
            });
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const {page, limit} = paginationDto;

        const count = await this.order.count();

        const lastPage = Math.ceil(count / limit);

        const data = await this.order.findMany({
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            meta: {
                page,
                limit,
                count,
                lastPage,
            },
        };
    }

    async findOne(id: string) {
        const order = await this.order.findFirst({
            where: {id},
            include: {
                items: {
                    select: {
                        quantity: true,
                        productId: true,
                        price: true,
                    },
                },
            },
        });

        if (!order) {
            throw new RpcException({
                status: HttpStatus.BAD_REQUEST,
                message: `Order with id #${id} not found`,
            });
        }

        const productIds = order.items.map((item) => item.productId);

        const products: any[] = await firstValueFrom(
            this.client.send('validate_products', productIds),
        );

        return {
            ...order,
            items: order.items.map((item) => {
                const product = products.find(
                    (product) => product.id === item.productId,
                );

                return {
                    ...item,
                    name: product.name,
                };
            }),
        };
    }

    async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
        const {id, status} = changeOrderStatusDto;

        const order = await this.findOne(id);
        if (order.status === status) {
            return order;
        }

        return this.order.update({
            where: {id},
            data: {status: status},
        });
    }
}
