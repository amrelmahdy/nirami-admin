import httpClient from "@/helpers/httpClient";

export const getAllSettings = async () => {
    const result = await httpClient.get("/settings");
    return result.data;
}



export const updateSettings = async (settings: any) => {
    const result = await httpClient.put("/settings", settings);
    return result.data;
}
