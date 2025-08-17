import { useQuery } from "@tanstack/react-query";
import { Product } from "../products/products.hooks";
import { getUsers } from "./users.api";


export enum UserRole {
    USER = 0,
    ADMIN = 1,
}

export type User = {
    firstName?: string;
    lastName?: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    id?: string;
    _id?: string;
    addresses?: any[];
    phone?: string;
    email?: string;
    gender: string;
    dateOfBirth?: string | Date;
    favList?: Product[],

};

export const useGetUsers = (type?: UserRole) => {
    const query =  useQuery({
        queryKey: ['users', type],
        queryFn: () => getUsers(type)
    });
    return query;
}