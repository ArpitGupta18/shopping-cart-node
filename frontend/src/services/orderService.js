import api from "./api";

const placeOrder = async () => {
	try {
		const res = await api.post("/orders");
		return res.data;
	} catch (error) {
		console.error("Failed to place order:", error);
	}
};

export default {
	placeOrder,
};
