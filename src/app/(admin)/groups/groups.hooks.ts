
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { Department } from "../departments/departments.hooks";
import { Category } from "../categories/categories.hooks";
import { addGroup, deleteGroup, getGroupDetails, getGroups, updateGroup } from "./groups.api";



export type Group = {
    name: {
        en: string;
        ar: string;
    };
    image: string;
    category: Category;
    createdAt: string;
    updatedAt: string;
    id: string;
};

export interface GroupFilters {
    query?: string;
    categoryId?: string;
  }




export const useGetGroups = (filters: GroupFilters = {}): UseQueryResult<Group[]> => {
  const query = useQuery({
    queryKey: ['groups', filters], // cache based on filters
    queryFn: () => getGroups(filters),
  });

  return query;
};




export const useAddGroup = () => {
    const mutation = useMutation({
        mutationFn: addGroup,
        onSuccess: (res) => {
            console.log("res for add group : ", res)
        }
    });

    return mutation;
}



export const useGetGroup = (id: string): UseQueryResult<Category> => {
    return useQuery({
        queryKey: ['group', id],
        queryFn: () => getGroupDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });
};



export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, group }: { id: string; group: any }) =>
            // Call your API for updating the product
            updateGroup(id, group),
        onSuccess: (res) => {
            console.log("Group updated:", res);
            // Invalidate the cache to refetch the updated product data
            // queryClient.invalidateQueries({ queryKey: ['brand', res.id] });
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
        onError: (error: any) => {
            console.error('Error updating group:', error?.response?.data || error.message);
        },
    });
};



export const useDeleteGroup = (): UseMutationResult<
    void, // Return type of mutationFn
    unknown, // Error type 
    string // Variable passed to mutationFn (department ID)
> => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteGroup as (id: string) => Promise<void>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });

    return mutation;
};