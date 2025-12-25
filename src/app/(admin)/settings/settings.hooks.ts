import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { User } from "../users/users.hooks";
import { getAllSettings, updateSettings } from "./settings.api";



export type Settings = {
    aboutUs: string,
    ourStory: string,
    returnAndExchangePolicy: string,
    contactWhatsapp: string,
    contactPhone: string,
    contactEmail: string
}



export const useGetAllSettings = (): UseQueryResult<Settings> => {
    const query = useQuery({
        queryKey: ['settings'], // cache based on filters
        queryFn: getAllSettings,
    });

    return query;
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ settings }: { settings: any }) =>
            // Call your API for updating the product
            updateSettings(settings),
        onSuccess: (res) => {
            console.log("Settings updated:", res);
            // Invalidate the cache to refetch the updated product data
            // queryClient.invalidateQueries({ queryKey: ['brand', res.id] });
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
        onError: (error: any) => {
            console.error('Error updating settings:', error?.response?.data || error.message);
        },
    });
};

