
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { Department } from "../departments/departments.hooks";
import { Category } from "../categories/categories.hooks";
import { addGroup, deleteGroup, getGroups } from "./groups.api";



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