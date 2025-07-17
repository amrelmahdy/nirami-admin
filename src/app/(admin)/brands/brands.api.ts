import httpClient from "@/helpers/httpClient";
import { Brand } from "./brands.hooks";

export const getBrands = async () => {
    const result = await httpClient.get("/brands");
    return result.data;
}


export const addbrand = async (brand: Brand) => {
    const result = await httpClient.post("/brands", brand);
    return result.data;
}


export const getBrandDetails = async (brandId: string) => {
    const result = await httpClient.get(`/brands/${brandId}`);
    return result.data;
}


export const updateBrand = async (brandId: string, brand: Brand) => {
    const result = await httpClient.put(`/brands/${brandId}`, brand);
    return result.data;
}   


export const deletebrand = async (id: string) => {
    const result = await httpClient.delete(`/categories/${id}`);
    return result.data;
}