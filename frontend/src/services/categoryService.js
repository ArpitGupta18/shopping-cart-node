import api from "../services/api.js";

const getCategories = async () => {
	const res = await api.get("/categories");
	return res.data;
};

export default { getCategories };
