import api from "./api.js";

const getProducts = async (params = {}) => {
	const res = await api.get("/products", { params });
	return res.data;
};

const getProductById = async (id) => {
	const res = await api.get(`/products/${id}`);
	return res.data;
};

export default { getProducts, getProductById };
