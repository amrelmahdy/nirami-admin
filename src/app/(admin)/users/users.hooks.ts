import { Product } from "../products/products.hooks";

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