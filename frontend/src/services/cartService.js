import api from "./api.js";

const addToCart = async (productId, quantity = 1) => {
	try {
		const res = await api.post("/cart", { productId, quantity });
		return res.data;
	} catch (error) {
		console.error("Failed to add to cart:", error);
	}
};

const getCart = async () => {
	try {
		const res = await api.get("/cart");
		return res.data;
	} catch (error) {
		console.error("Failed to get cart:", error);
	}
};

export default { addToCart, getCart };
