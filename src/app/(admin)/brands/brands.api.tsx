import httpClient from "@/helpers/httpClient";
import { Brand } from "./brands.hooks";

export const getBrands = async () => {
    const result = await httpClient.get("http://localhost:3000/brands");
    return result.data;
}


export const addbrand = async (brand: Brand) => {
    const result = await httpClient.post("http://localhost:3000/brands", brand);
    return result.data;
}


export const deletebrand = async (id: string) => {
    const result = await httpClient.delete(`http://localhost:3000/categories/${id}`);
    return result.data;
}