
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { getOrderDetails, getOrders, updateOrder } from "./orders.api";
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



export const useGetOrdres = (): UseQueryResult<Order[]> => {
    const query = useQuery({
        queryKey: ['orders'], // cache based on filters
        queryFn: getOrders,
        staleTime: 0,
        gcTime: 0, // renamed from cacheTime in v5
    });

    return query;
};



export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, order }: { id: string; order: any }) =>
            // Call your API for updating the product
            updateOrder(id, order),
        onSuccess: (res) => {
            console.log("Group updated:", res);
            // Invalidate the cache to refetch the updated product data
            // queryClient.invalidateQueries({ queryKey: ['brand', res.id] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
        onError: (error: any) => {
            console.error('Error updating order:', error?.response?.data || error.message);
        },
    });
};


export const useGetOrderDetails = (id: string): UseQueryResult<Order> => {
    const query = useQuery({
        queryKey: ['order', id],
        queryFn: () => getOrderDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });

    return query;
};






