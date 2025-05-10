import httpClient from "@/helpers/httpClient";
import { Department } from "./departments.hooks";

export const getDepartments = async () => {
    const result = await httpClient.get("http://localhost:3000/departments");
    return result.data;
}


export const addDepartment = async (department: Department) => {
    const result = await httpClient.post("http://localhost:3000/departments", department);
    return result.data;
}


export const deleteDepartment = async (id: string) => {
    const result = await httpClient.delete(`http://localhost:3000/departments/${id}`);
    return result.data;
}