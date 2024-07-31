import {OrderStatus} from "@prisma/client";

export type OrderWithProducts = {
    id: string;
    totalAmount: number;
    totalItems: number;
    status: OrderStatus;
    paid: boolean;
    paidAt: Date | null;
    stripeChargeId: string | null;
    createdAt: string;
    updatedAt: string;
    items: Product[];
}

export type Product = {
    quantity: number;
    productId: number;
    price: number;
    name: string;
}