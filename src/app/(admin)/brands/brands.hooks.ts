
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addbrand, deletebrand, getBrandDetails, getBrands, updateBrand } from "./brands.api";


export type Brand = {
    name: {
        en: string;
        ar: string;
    };
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    id?: string;
};



export const useGetBrands = (): UseQueryResult<Brand[]> => {
    const query = useQuery({ queryKey: ['brands'], queryFn: getBrands });
    return query;
}

export const useAddBrand = () => {
    const mutation = useMutation({
        mutationFn: addbrand,
        onSuccess: (res) => {
            console.log("res for add category : ", res)
        }
    });

    return mutation;
}





export const useGetBrand = (id: string): UseQueryResult<Brand> => {
    return useQuery({
        queryKey: ['brand', id],
        queryFn: () => getBrandDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });
};



export const useUpdateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, brand }: { id: string; brand: any }) =>
            // Call your API for updating the product
            updateBrand(id, brand),
        onSuccess: (res) => {
            console.log("Brand updated:", res);
            // Invalidate the cache to refetch the updated product data
            // queryClient.invalidateQueries({ queryKey: ['brand', res.id] });
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
        onError: (error: any) => {
            console.error('Error updating brand:', error?.response?.data || error.message);
        },
    });
};



export const useDeleteBrand = (): UseMutationResult<
  void, // Return type of mutationFn
  unknown, // Error type 
  string // Variable passed to mutationFn (department ID)
> => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletebrand as (id: string) => Promise<void>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  return mutation;
};