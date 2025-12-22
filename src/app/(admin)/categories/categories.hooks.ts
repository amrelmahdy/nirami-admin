
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addCategory, deleteCategory, getCategories, getCategoryDetails, updateCategory } from "./categories.api";
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



export const useGetCategory = (id: string): UseQueryResult<Category> => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: () => getCategoryDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });
};



export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, category }: { id: string; category: any }) =>
            // Call your API for updating the product
            updateCategory(id, category),
        onSuccess: (res) => {
            console.log("Category updated:", res);
            // Invalidate the cache to refetch the updated product data
            // queryClient.invalidateQueries({ queryKey: ['brand', res.id] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            console.error('Error updating brand:', error?.response?.data || error.message);
        },
    });
};


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