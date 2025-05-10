
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addCategory, deleteCategory, getCategories } from "./categories.api";
import { Department } from "../departments/departments.hooks";



export type Category = {
    name: {
        en: string;
        ar: string;
    };
    department: Department,
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    id?: string;
};



export interface CategoryFilters {
  query?: string;
  departmentId?: string;
}

export const useGetCategories = (filters: CategoryFilters = {}): UseQueryResult<Category[]> => {
  const query = useQuery({
    queryKey: ['categories', filters], // cache based on filters
    queryFn: () => getCategories(filters),
  });

  return query;
};

export const useAddCategory = () => {
    const mutation = useMutation({
        mutationFn: addCategory,
        onSuccess: (res) => {
            console.log("res for add category : ", res)
        }
    });

    return mutation;
}



export const useDeleteCategory = (): UseMutationResult<
  void, // Return type of mutationFn
  unknown, // Error type 
  string // Variable passed to mutationFn (department ID)
> => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategory as (id: string) => Promise<void>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return mutation;
};