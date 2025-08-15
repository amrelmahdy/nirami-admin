import httpClient from "@/helpers/httpClient";
import { Category } from "./categories.hooks";
import { Group, GroupFilters } from "./groups.hooks";

// export const getGroups = async () => {
//     const result = await httpClient.get("/groups");
//     return result.data;
// }



export const getGroups = async (filters: GroupFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.query) params.append('query', filters.query);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);

    const url = `/groups?${params.toString()}`;
    const result = await httpClient.get(url);
    return result.data;
};


type NewGroup = Omit<Group, 'category'> & {
    category: string;
};

export const addGroup = async (group: NewGroup) => {
    const result = await httpClient.post("/groups", group);
    return result.data;
}


export const deleteGroup = async (id: string) => {
    const result = await httpClient.delete(`/groups/${id}`);
    return result.data;
}