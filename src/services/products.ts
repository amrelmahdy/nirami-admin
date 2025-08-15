import axios from "axios";

export const getProducts = async () => {
    const result = await axios.get("/products");
    return result.data;
}