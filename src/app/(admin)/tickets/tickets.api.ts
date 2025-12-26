import httpClient from "@/helpers/httpClient";

export const getTickets = async () => {
    const result = await httpClient.get('/tickets');
    return result.data;
};


export const getTicketDetails = async (ticketId: string) => {
    const result = await httpClient.get(`/tickets/${ticketId}`);
    return result.data;
};
