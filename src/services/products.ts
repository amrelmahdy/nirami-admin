import axios from "axios";

export const getProducts = async () => {
    const result = await axios.get("http://localhost:3000/products");
    return result.data;
}