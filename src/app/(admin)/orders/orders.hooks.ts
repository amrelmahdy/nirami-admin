
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { getOrderDetails, getOrders } from "./orders.api";
import { User } from "../users/users.hooks";


export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_failed'
  | 'processing'
  | 'on_hold'
  | 'ready_for_pickup'
  | 'shipped'
  | 'partially_shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'returned'
  | 'refunded'
  | 'partially_refunded';

export type Order = {
    id?: string;
    _id?: string;
    user: User;
    finalPrice: number,
    paymentMethod: string,
    shippingCost: number,
    paymentStatus: string,
    shippingAddress: string,
    status: OrderStatus,
    orderNumber: string,
}



export const useGetOrdres = (): UseQueryResult<Order[]> => {
    const query = useQuery({
        queryKey: ['orders'], // cache based on filters
        queryFn: getOrders,
    });

    return query;
};



export const useGetOrderDetails = (id: string): UseQueryResult<Order> => {
    const query = useQuery({
        queryKey: ['order', id],
        queryFn: () => getOrderDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });

    return query;
};






