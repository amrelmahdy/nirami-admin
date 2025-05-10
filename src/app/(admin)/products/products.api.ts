import httpClient from "@/helpers/httpClient";
import { Product } from "./products.hooks";

export const getProducts = async () => {
    const result = await httpClient.get("http://localhost:3000/products");
    return result.data;
}

export const addProduct = async (product: Product) => {
    const result = await httpClient.post("http://localhost:3000/departments", product);
    return result.data;
}
