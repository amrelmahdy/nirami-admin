import httpClient from "@/helpers/httpClient";
import { Product, Variant } from "./products.hooks";


export interface ProductFilters {
    query?: string;
    groupId?: string;
    categoryId?: string;
    brandId?: string;
    sortBy?: string;
    priceFrom?: string;
    priceTo?: string;
    onlyParents?: boolean;
}



export const getProducts = async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query);
    if (filters.groupId) params.append('groupId', filters.groupId);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.brandId) params.append('brandId', filters.brandId);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.priceFrom) params.append('priceFrom', filters.priceFrom);
    if (filters.priceTo) params.append('priceTo', filters.priceTo);
     if (filters.onlyParents) params.append('onlyParents', filters.onlyParents ? 'true' : 'false');
    const url = `/products?${params.toString()}`;
    const result = await httpClient.get(url);
    return result.data;
};


export const getProductDetails = async (productId: string) => {
    const result = await httpClient.get(`/products/${productId}`);
    return result.data;
}

export const getProductVariants = async (productId: string) => {
    const result = await httpClient.get(`/products/${productId}/variants`);
    return result.data;
}


export const addProduct = async (product: Product) => {
    const result = await httpClient.post("/products", product);
    return result.data;
}


export const updateProduct = async (productId: string, product: Product) => {
    const result = await httpClient.put(`/products/${productId}`, product);
    return result.data;
}



