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

const updateCartItem = async (cartItemId, quantity) => {
	try {
		const res = await api.put(`/cart/${cartItemId}`, { quantity });
		return res.data;
	} catch (error) {
		console.error("Failed to update cart item:", error);
	}
};

const deleteCartItem = async (cartItemId) => {
	try {
		const res = await api.delete(`/cart/${cartItemId}`);
		return res.data;
	} catch (error) {
		console.error("Failed to delete cart item:", error);
	}
};

const clearCart = async () => {
	try {
		const res = await api.delete("/cart/clear");
		return res.data;
	} catch (error) {
		console.error("Failed to clear cart:", error);
	}
};

export default {
	addToCart,
	getCart,
	updateCartItem,
	deleteCartItem,
	clearCart,
};
