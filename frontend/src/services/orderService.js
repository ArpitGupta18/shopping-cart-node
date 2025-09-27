import api from "./api";

const placeOrder = async () => {
	try {
		const res = await api.post("/orders");
		return res.data;
	} catch (error) {
		console.error("Failed to place order:", error);
	}
};

const getUserOrder = async () => {
	try {
		const res = await api.get("/orders");
		return res.data.orders;
	} catch (error) {
		console.error("Failed to fetch user orders:", error);
	}
};

export default {
	placeOrder,
	getUserOrder,
};
