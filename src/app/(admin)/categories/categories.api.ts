import httpClient from "@/helpers/httpClient";
import { Category, CategoryFilters } from "./categories.hooks";

export const getCategories = async (filters: CategoryFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);

    const url = `/categories?${params.toString()}`;
    const result = await httpClient.get(url);
    return result.data;
};

type NewCategory = Omit<Category, 'department'> & {
    department: string; // overriding 'name' to be a number
};

export const addCategory = async (department: NewCategory) => {
    const result = await httpClient.post("/categories", department);
    return result.data;
}


export const deleteCategory = async (id: string) => {
    const result = await httpClient.delete(`/categories/${id}`);
    return result.data;
}