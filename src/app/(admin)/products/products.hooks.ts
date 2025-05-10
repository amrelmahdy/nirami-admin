import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addProduct, getProducts } from "./products.api"
import { deleteCategory } from "../categories/categories.api";


type LocalizedName = {
    en: string;
    ar: string;
};

type Brand = {
    name: {
        en: string;
        ar: string;
    };
    image: string;
    createdAt: string;
    updatedAt: string;
    id: string;
};


type Department = {
    name: {
        en: string;
        ar: string;
    };
    image: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    id: string;
};

type Category = {
    name: {
        en: string;
        ar: string;
    };
    department: Department,
    image: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    id: string;
};


type Group = {
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


export type Product = {
    name: LocalizedName;
    description: LocalizedName;
    components: LocalizedName;
    brand: Brand;
    group: Group;
    price: number;
    salesPrice: number;
    maxQuantity: number;
    stock: number;
    sku: string;
    averageRating: number;
    reviewCount: number;
    productCardImage: string;
    images: string[];
    isOutOfStock: boolean;
    isOnSale: boolean;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    reviews: any[];
    id: string;
};


export const useGetProducts = (): UseQueryResult<Product[]> => {
    const query = useQuery({ queryKey: ['products'], queryFn: getProducts });
    return query;
}


export const useAddProduct = () => {
    const mutation = useMutation({
        mutationFn: addProduct,
        onSuccess: (res) => {
            console.log("res for add product : ", res)
        }
    });

    return mutation;
}


export const useDeleteProduct = (): UseMutationResult<
  void, // Return type of mutationFn
  unknown, // Error type 
  string // Variable passed to mutationFn (department ID)
> => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCategory as (id: string) => Promise<void>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return mutation;
};
