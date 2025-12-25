import httpClient from "@/helpers/httpClient";
import { Order } from "./orders.hooks";

export const getOrders = async () => {
    const result = await httpClient.get("/orders");
    return result.data;
}


export const getOrderDetails = async (orderId: string) => {
    const result = await httpClient.get(`/orders/${orderId}`);
    return result.data;
}


export const updateOrder = async (orderId: string, order: Order) => {
    const result = await httpClient.put(`/orders/${orderId}`, order);
    return result.data;
}
