import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addDepartment, deleteDepartment, getDepartments } from "./departments.api"


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