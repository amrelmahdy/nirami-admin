
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { User } from "../users/users.hooks";
import { getTicketDetails, getTickets, updateTicket } from "./tickets.api";


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


export type Ticket = {
    name: string
    phone: string
    email: string
    type: "complaint" | "return" | "exchange" | "other";
    message: string;
    orderNumber: string;
    createdAt: string;
    updatedAt: string;
    status: "created" | "processing" | "completed" | "closed";
    ticketNumber: string;
    user: User;
    _id: string;
}




export const useGetTickets = (): UseQueryResult<Ticket[]> => {
    const query = useQuery({
        queryKey: ['tickets'], // cache based on filters
        queryFn: getTickets,
        staleTime: 0,
        gcTime: 0, // renamed from cacheTime in v5
    });

    return query;
};



export const useUpdateTicket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ticket }: { id: string; ticket: any }) =>
            // Call your API for updating the product
            updateTicket(id, ticket),
        onSuccess: (res) => {
            console.log("Ticket updated:", res);
            // Invalidate the cache to refetch the updated product data
            // queryClient.invalidateQueries({ queryKey: ['brand', res.id] });
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
        onError: (error: any) => {
            console.error('Error updating ticket:', error?.response?.data || error.message);
        },
    });
};





export const useGetTicketDetails = (id: string): UseQueryResult<Ticket> => {
    const query = useQuery({
        queryKey: ['order', id],
        queryFn: () => getTicketDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });

    return query;
};






