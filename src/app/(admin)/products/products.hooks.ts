import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query"
import { addProduct, addVariant, deleteVariant, getProductDetails, getProducts, getProductVariants, ProductFilters, updateProduct } from "./products.api"
import { deleteCategory } from "../categories/categories.api";




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



export type Variant = {
    id?: string
    name: { ar: string; en: string };
    sku: string;
    price: number;
    salesPrice: number;
    stock: number;
    maxQuantity: number;
    images?: [{
        public_id: string,
        url: string
    }];
    color: string
}

export type Product = {
    name: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    components: {
        en: string;
        ar: string;
    };
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
    images: [{
        public_id: string,
        url: string
    }];
    variants: Variant[];
    isOutOfStock: boolean;
    isOnSale: boolean;
    isFeatured: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    reviews: any[];
    id: string;
    color: {
        name: {
            ar: string;
            en: string;
        };
        value: string;
    };
};



export const useGetProducts = (filters: ProductFilters = {}): UseQueryResult<Product[]> => {
    const query = useQuery({
        queryKey: ['products', filters], // cache based on filters
        queryFn: () => getProducts(filters),
    });

    return query;
};

export const useGetProduct = (id: string): UseQueryResult<Product> => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductDetails(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });
};


export const useGetProductVariants = (id: string): UseQueryResult<Product[]> => {
    return useQuery({
        queryKey: ['product-variants', id],
        queryFn: () => getProductVariants(id),
        enabled: !!id, // optional: prevents the query from running if id is falsy
    });
};


export const useAddProduct = () => {
    return useMutation({
        mutationFn: addProduct,
        onSuccess: (res) => {
            console.log("res for add product : ", res)
        }
    });
}


export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, product }: { id: string; product: any }) =>
            // Call your API for updating the product
            updateProduct(id, product),
        onSuccess: (res) => {
            console.log("Product updated:", res);
            // Invalidate the cache to refetch the updated product data
            queryClient.invalidateQueries({ queryKey: ['product', res.id] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            console.error('Error updating product:', error?.response?.data || error.message);
        },
    });
};



export const useDeleteProduct = (): UseMutationResult<
    void, // Return type of mutationFn
    unknown, // Error type 
    string // Variable passed to mutationFn (department ID)
> => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCategory as (id: string) => Promise<void>,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};








// export const useDeleteVariant = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: ({ productId, variantId }: { productId: string, variantId: string }) => deleteVariant(productId, variantId),
//         onSuccess: (_res, { productId }) => {
//             console.log("variant deleted", productId)
//             queryClient.invalidateQueries({ queryKey: ['product', productId] });
//         },
//         onError: (error: any) => {
//             console.error('Error adding variant:', error?.response?.data || error.message);
//         },
//     });
// };