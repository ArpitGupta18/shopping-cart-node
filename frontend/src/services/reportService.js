import api from "./api.js";

const getDayWiseReport = async (params = {}) => {
	const res = await api.get("/report/daywise", { params });
	return res.data;
};

const getSummaryReport = async (params = {}) => {
	const res = await api.get("/report/summary", { params });
	return res.data;
};

export default { getDayWiseReport, getSummaryReport };
