import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	CartesianGrid,
	YAxis,
	Legend,
	Tooltip,
} from "recharts";
import reportService from "../../services/reportService";

const Dashboard = () => {
	const [reportData, setReportData] = useState([]);

	const fetchReportData = async () => {
		const response = await reportService.getDayWiseReport();
		console.log("Chart Data:", response);
		setReportData(response.data);
	};

	useEffect(() => {
		fetchReportData();
	}, []);

	return (
		<div>
			<LineChart
				width={600}
				height={300}
				data={reportData}
				margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
				className="p-2 mt-5"
			>
				<CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
				<Line
					type="monotone"
					dataKey="totalSold"
					stroke="#8884d8"
					strokeWidth={2}
				/>
				<XAxis
					dataKey="date"
					dy={10}
					// label={{ value: "Date", position: "insideBottom", dy: 30 }}
				/>
				<YAxis
					label={{
						value: "Total Sold",
						angle: -90,
						position: "insideLeft",
						offset: 10,
						dy: 0,
						style: { textAnchor: "middle" },
					}}
				/>
				<Legend
					verticalAlign="bottom"
					align="center"
					wrapperStyle={{ paddingTop: 20 }}
				/>
				<Tooltip />
			</LineChart>
		</div>
	);
};

export default Dashboard;
