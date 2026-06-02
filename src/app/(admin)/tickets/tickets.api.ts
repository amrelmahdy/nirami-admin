import httpClient from "@/helpers/httpClient";
import { Ticket } from "./tickets.hooks";

export const getTickets = async () => {
    const result = await httpClient.get('/tickets');
    return result.data;
};


export const getTicketDetails = async (ticketId: string) => {
    const result = await httpClient.get(`/tickets/${ticketId}`);
    return result.data;
};


export const updateTicket = async (ticketId: string, ticket: Ticket) => {
    const result = await httpClient.put(`/tickets/${ticketId}`, ticket);
    return result.data;
}