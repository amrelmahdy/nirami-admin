import httpClient from "@/helpers/httpClient";
import { Department } from "./departments.hooks";

export const getDepartments = async () => {
    const result = await httpClient.get("/departments");
    return result.data;
}


export const addDepartment = async (department: Department) => {
    const result = await httpClient.post("/departments", department);
    return result.data;
}




export const getDepartmentDetails = async (departmentId: string) => {
    const result = await httpClient.get(`/departments/${departmentId}`);
    return result.data;
}



export const updateDepartment = async (departmentId: string, department: Department) => {
    const result = await httpClient.put(`/departments/${departmentId}`, department);
    return result.data;
}   


export const deleteDepartment = async (id: string) => {
    const result = await httpClient.delete(`/departments/${id}`);
    return result.data;
}