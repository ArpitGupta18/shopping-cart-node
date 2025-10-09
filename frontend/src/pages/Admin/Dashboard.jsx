import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	CartesianGrid,
	YAxis,
	Legend,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import reportService from "../../services/reportService";
import { DateRange } from "react-date-range";
import { format, startOfMonth } from "date-fns";

const COLORS = ["#8884d8", "#82ca9d", "#ff6961", "#f5b642", "#00C49F"];

const Dashboard = () => {
	const [dayWiseData, setDayWiseData] = useState([]);
	const [summaryData, setSummaryData] = useState({
		totalRevenue: 0,
		totalSold: 0,
		// totalUsersRegistered: 0,
		// totalProductsAdded: 0,
		totalCategories: 0,
		totalOrders: 0,
		topSoldProducts: [],
	});
	const [totalOrderDeliveryStatus, setTotalOrderDeliveryStatus] = useState(
		[]
	);

	const defaultRange = {
		startDate: startOfMonth(new Date()),
		endDate: new Date(),
		key: "selection",
	};

	const [range, setRange] = useState([defaultRange]);

	const [showPicker, setShowPicker] = useState(false);

	const fetchReportData = async (start, end) => {
		const response = await reportService.getDayWiseReport({
			start,
			end,
		});
		console.log("Chart Data:", response);
		setDayWiseData(response.data);
	};

	const fetchSummaryData = async (start, end) => {
		const response = await reportService.getSummaryReport({ start, end });
		console.log("Summary Data:", response);
		setSummaryData(response.data);
	};

	const fetchTotalOrderDeliveryStatus = async () => {
		try {
			const response = await reportService.getTotalOrderDeliveryStatus();
			console.log("Total Order Delivery Status:", response);

			const payload = response?.data?.data ?? response?.data ?? response;
			const normalized = Array.isArray(payload)
				? payload.map((row) => ({
						deliveryStatus: row.deliveryStatus,
						count: Number(row.count) || 0,
				  }))
				: [];

			setTotalOrderDeliveryStatus(normalized);
		} catch (err) {
			console.error("Failed to fetch order delivery status:", err);
			setTotalOrderDeliveryStatus([]);
		}
	};

	useEffect(() => {
		fetchReportData(defaultRange.startDate, defaultRange.endDate);
		fetchSummaryData(defaultRange.startDate, defaultRange.endDate);
		fetchTotalOrderDeliveryStatus();
	}, []);

	const handleFilter = async () => {
		const startDate = format(range[0].startDate, "yyyy-MM-dd");
		const endDate = format(range[0].endDate, "yyyy-MM-dd");

		await fetchReportData(startDate, endDate);
		await fetchSummaryData(startDate, endDate);
		console.log("Filter applied:", startDate, endDate);
		setShowPicker(false);
	};

	const handleReset = async () => {
		setRange([defaultRange]);
		await fetchReportData(defaultRange.startDate, defaultRange.endDate);
		await fetchSummaryData(defaultRange.startDate, defaultRange.endDate);
		setShowPicker(false);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-end">
				<div className="relative">
					<button
						onClick={() => setShowPicker(!showPicker)}
						className="bg-white border px-3 py-2 rounded-md shadow-sm text-sm hover:bg-gray-50 transition-all"
					>{`${format(range[0].startDate, "MMM dd, yyyy")} - ${format(
						range[0].endDate,
						"MMM dd, yyyy"
					)}`}</button>
					{showPicker && (
						<div className="absolute right-0 mt-2 z-20 bg-white shadow-lg rounded-lg p-2">
							<DateRange
								editableDateInputs={true}
								onChange={(item) => setRange([item.selection])}
								moveRangeOnFirstSelection={false}
								ranges={range}
								maxDate={new Date()}
							/>

							<div className="flex justify-end mt-2 gap-2">
								<button
									onClick={handleReset}
									className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm transition-all"
								>
									Reset
								</button>
								<button
									onClick={handleFilter}
									className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm transition-all"
								>
									Apply
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
				{/* Total Revenue */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
					<p className="text-sm text-gray-500 font-medium mb-1">
						Total Revenue
					</p>
					<h3 className="text-2xl font-semibold text-green-600">
						${summaryData.totalRevenue?.toLocaleString() || 0}
					</h3>
				</div>

				{/* Total Items Sold */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
					<p className="text-sm text-gray-500 font-medium mb-1">
						Total Items Sold
					</p>
					<h3 className="text-2xl font-semibold text-indigo-600">
						{summaryData.totalSold || 0}
					</h3>
				</div>

				{/* Total Users Registered */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
					<p className="text-sm text-gray-500 font-medium mb-1">
						Total Product Categories
					</p>
					<h3 className="text-2xl font-semibold text-blue-500">
						{summaryData.totalCategories || 0}
					</h3>
				</div>

				{/* Total Products Added */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300">
					<p className="text-sm text-gray-500 font-medium mb-1">
						Total Orders made
					</p>
					<h3 className="text-2xl font-semibold text-teal-600">
						{summaryData.totalOrders || 0}
					</h3>
				</div>
			</div>

			<div className="mt-5 flex ">
				<div className="relative w-full h-[450px] bg-white rounded-xl shadow-md border border-gray-200 pt-1 pb-3 px-3">
					<h2 className="text-lg font-semibold text-gray-800 p-4">
						Revenue (per day)
					</h2>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={dayWiseData}
							margin={{
								top: 20,
								right: 20,
								bottom: 70,
								left: 20,
							}}
							className="p-2"
						>
							{dayWiseData.length > 0 && (
								<>
									<CartesianGrid
										stroke="#aaa"
										strokeDasharray="5 5"
									/>
									<Line
										type="monotone"
										dataKey="totalRevenue"
										stroke="#8884d8"
										strokeWidth={2}
										name="Total Revenue ($)"
									/>
									<Tooltip />
									<Legend
										verticalAlign="bottom"
										align="center"
										wrapperStyle={{ paddingTop: 20 }}
									/>
									<XAxis dataKey="date" dy={10} />
									<YAxis
										label={{
											value: `Revenue ($)`,
											angle: -90,
											position: "insideLeft",
											offset: -10,
											style: { textAnchor: "middle" },
										}}
									/>
								</>
							)}
						</LineChart>
					</ResponsiveContainer>
					{/* Overlay when no data */}
					{dayWiseData.length === 0 && (
						<div className="absolute inset-0 flex items-center justify-center">
							<p className="text-gray-500 font-medium bg-white/90 px-4 py-2 rounded-md shadow">
								No data available for this period
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Top Sold Products Chart */}
			<div className="mt-8 flex gap-8">
				<div className="relative w-1/2 h-[400px] bg-white rounded-xl shadow-md border border-gray-200 pt-1 pb-3 px-3">
					<h2 className="text-lg font-semibold text-gray-800 p-4">
						Top Sold Products
					</h2>

					<ResponsiveContainer width="100%" height="90%">
						<BarChart
							data={summaryData.topSoldProducts.map((item) => ({
								name: item["Product.name"],
								totalSold: Number(item.totalSold),
								image: item["Product.image"],
								price: item["Product.price"],
							}))}
							margin={{
								top: 20,
								right: 20,
								bottom: 10,
								left: 20,
							}}
							barSize={40}
						>
							{summaryData.topSoldProducts.length > 0 && (
								<>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#e5e7eb"
									/>
									<XAxis
										dataKey="name"
										angle={-15}
										textAnchor="end"
										interval={0}
										height={60}
										tick={{ fill: "#4b5563", fontSize: 12 }}
									/>
									<YAxis
										label={{
											value: "Total Sold",
											angle: -90,
											position: "insideLeft",
											style: { textAnchor: "middle" },
										}}
										tick={{ fill: "#4b5563", fontSize: 12 }}
									/>
									<Tooltip
										content={({ payload }) => {
											if (payload && payload.length) {
												const {
													name,
													totalSold,
													image,
													price,
												} = payload[0].payload;
												return (
													<div className="bg-white shadow-md p-3 rounded-md border text-sm">
														<img
															src={image}
															alt={name}
															className="w-16 h-16 object-cover rounded-md mb-2"
														/>
														<p className="font-medium text-gray-800">
															{name}
														</p>
														<p className="text-gray-500">
															Price: ${price}
														</p>
														<p className="text-indigo-600 font-semibold">
															Sold: {totalSold}
														</p>
													</div>
												);
											}
											return null;
										}}
									/>
									<Legend
										verticalAlign="top"
										align="right"
										iconType="circle"
										height={36}
									/>
									<Bar
										dataKey="totalSold"
										fill="#6366f1" // Indigo color (consistent with your theme)
										radius={[4, 4, 0, 0]}
										name="Total Sold"
									/>
								</>
							)}
						</BarChart>
					</ResponsiveContainer>

					{/* No Data Overlay */}
					{summaryData.topSoldProducts.length === 0 && (
						<div className="absolute inset-0 flex items-center justify-center">
							<p className="text-gray-500 font-medium bg-white/90 px-4 py-2 rounded-md shadow">
								No product sales data available
							</p>
						</div>
					)}
				</div>
				<div className="relative w-1/2 h-[400px] bg-white rounded-xl shadow-md border border-gray-200 pt-1 pb-3 px-3">
					<h2 className="text-lg font-semibold text-gray-800 p-4">
						Payment Status
					</h2>
					{/* <ResponsiveContainer width="100%" height="90%">
						<PieChart>
							<Tooltip
								formatter={(value, name) => [
									value,
									name === "deliveryStatus" ? "Status" : name,
								]}
							/>
							<Legend verticalAlign="top" height={36} />
							<Pie
								data={totalOrderDeliveryStatus}
								dataKey="count"
								nameKey="deliveryStatus"
								cx="50%"
								cy="50%"
								outerRadius={120}
								innerRadius={60}
								labelLine={false}
								label={({
									cx,
									cy,
									midAngle,
									innerRadius,
									outerRadius,
									percent,
									index,
								}) => {
									const RADIAN = Math.PI / 180;
									const radius =
										innerRadius +
										(outerRadius - innerRadius) * 0.5;
									const x =
										cx +
										radius * Math.cos(-midAngle * RADIAN);
									const y =
										cy +
										radius * Math.sin(-midAngle * RADIAN);
									const entry =
										totalOrderDeliveryStatus[index];
									return (
										<text
											x={x}
											y={y}
											fill="#fff"
											textAnchor={
												x > cx ? "start" : "end"
											}
											dominantBaseline="central"
											style={{ fontSize: 12 }}
										>
											{entry
												? `${
														entry.deliveryStatus
												  } (${Math.round(
														percent * 100
												  )}%)`
												: ""}
										</text>
									);
								}}
							>
								{totalOrderDeliveryStatus.map(
									(entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									)
								)}
							</Pie>
						</PieChart>
					</ResponsiveContainer> */}

					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Tooltip
								formatter={(value, name) => [
									value,
									name === "count" ? "Orders" : name,
								]}
								contentStyle={{
									backgroundColor: "white",
									borderRadius: "8px",
									border: "1px solid #ddd",
									color: "#fff",
								}}
							/>
							<Legend verticalAlign="bottom" height={36} />

							<Pie
								data={totalOrderDeliveryStatus}
								dataKey="count"
								nameKey="deliveryStatus"
								cx="50%"
								cy="50%"
								innerRadius={70}
								outerRadius={120}
								// label={({ deliveryStatus, percent }) =>
								// 	`${deliveryStatus}: ${(
								// 		percent * 100
								// 	).toFixed(0)}%`
								// }
								// labelLine={false}
							>
								{totalOrderDeliveryStatus.map(
									(entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									)
								)}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
