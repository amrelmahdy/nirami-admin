
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { User } from "../users/users.hooks";
import { getTicketDetails, getTickets } from "./tickets.api";


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
    | 'partially_refunded'
    | `expired`
    | 'rescheduled';

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



export const useGetTickets = (): UseQueryResult<Order[]> => {
    const query = useQuery({
        queryKey: ['tickets'], // cache based on filters
        queryFn: getTickets,
        staleTime: 0,
        gcTime: 0, // renamed from cacheTime in v5
    });

    return query;
};





export const useGetTicketDetails = (id: string): UseQueryResult<Order> => {
    const query = useQuery({
        queryKey: ['order', id],
        queryFn: () => getTicketDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });

    return query;
};






