import httpClient from "@/helpers/httpClient";
import { UserRole } from "./users.hooks";

export const getUsers = async (type?: string) => {
    const params = new URLSearchParams();
    if (type !== undefined) params.append('type', type);
    const url = `/users?${params.toString()}`;
    const result = await httpClient.get(url);
    return result.data;
}

