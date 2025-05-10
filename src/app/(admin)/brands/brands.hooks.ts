
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addbrand, deletebrand, getBrands } from "./brands.api";


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

export const useAddBrands = () => {
    const mutation = useMutation({
        mutationFn: addbrand,
        onSuccess: (res) => {
            console.log("res for add category : ", res)
        }
    });

    return mutation;
}



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