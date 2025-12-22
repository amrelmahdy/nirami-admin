import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addDepartment, deleteDepartment, getDepartmentDetails, getDepartments, updateDepartment } from "./departments.api"


export type Department = {
    name: {
        en: string;
        ar: string;
    };
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    id?: string;
};



export const useGetDepartments = (): UseQueryResult<Department[]> => {
    const query = useQuery({ queryKey: ['departments'], queryFn: getDepartments });
    return query;
}

export const useAddDepartment = () => {
    const mutation = useMutation({
        mutationFn: addDepartment,
        onSuccess: (res) => {
            console.log("res to add department", res)
        }
    });

    return mutation;
}



export const useGetDepartment = (id: string): UseQueryResult<Department> => {
    return useQuery({
        queryKey: ['department', id],
        queryFn: () => getDepartmentDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
        staleTime: 0,
        gcTime: 0, // renamed from cacheTime in v5
    });
};




export const useUpdateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, brand }: { id: string; brand: any }) =>
            // Call your API for updating the product
            updateDepartment(id, brand),
        onSuccess: (res) => {
            console.log("Department updated:", res);
            // Invalidate the cache to refetch the updated product data
            // queryClient.invalidateQueries({ queryKey: ['brand', res.id] });
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        },
        onError: (error: any) => {
            console.error('Error updating department:', error?.response?.data || error.message);
        },
    });
};



export const useDeleteDepartment = (): UseMutationResult<
    void, // Return type of mutationFn
    unknown, // Error type 
    string // Variable passed to mutationFn (department ID)
> => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteDepartment as (id: string) => Promise<void>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
        },
    });

    return mutation;
};