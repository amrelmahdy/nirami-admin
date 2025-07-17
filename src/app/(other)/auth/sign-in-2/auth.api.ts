import httpClient from "@/helpers/httpClient";

export const login = async (username: string, password: string) => {
    const result = await httpClient.post("/auth/login", {
        username, password
    });
    return result.data;
}

