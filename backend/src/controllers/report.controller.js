import sequelize from "../config/db.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import { Op } from "sequelize";
import User from "../models/User.js";
import Category from "../models/Category.js";

const getDayWiseReport = async (req, res) => {
	try {
		// optional query range
		const { start, end } = req.query;
		const whereClause = {};

		if (start && end) {
			const startDate = new Date(start);
			const endDate = new Date(end);

			endDate.setHours(23, 59, 59, 999);
			whereClause.createdAt = {
				[Op.between]: [startDate, endDate],
			};
		}

		// group order items by date (based on their parent order date)
		const report = await OrderItem.findAll({
			attributes: [
				[
					sequelize.fn("DATE", sequelize.col("Order.createdAt")),
					"date",
				],
				[sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
				[
					sequelize.fn(
						"SUM",
						sequelize.literal('quantity * "OrderItem"."price"')
						// sequelize.col("Order.totalPrice")
					),
					"totalRevenue",
				],
			],
			include: [{ model: Order, attributes: [], where: whereClause }],
			group: ["date"],
			order: [[sequelize.literal("date"), "ASC"]],
			raw: true,
		});

		if (!report.length)
			// return res.status(404).json({ message: "No sales data found" });
			return res.json({ success: false, data: [] });

		res.status(200).json({ success: true, data: report });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Failed to generate day-wise report" });
	}
};

export const getSummaryReport = async (req, res) => {
	try {
		const { start, end } = req.query;
		const whereClause = {};

		if (start && end) {
			const startDate = new Date(start);
			const endDate = new Date(end);

			endDate.setHours(23, 59, 59, 999);
			whereClause.createdAt = {
				[Op.between]: [startDate, endDate],
			};
		}

		// Total sales and revenue combined
		const totals = await OrderItem.findAll({
			attributes: [
				[sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
				[
					sequelize.fn(
						"SUM",
						sequelize.literal(
							'"OrderItem"."quantity" * "OrderItem"."price"'
						)
						// sequelize.col("Order.totalPrice")
					),
					"totalRevenue",
				],
			],
			include: [{ model: Order, attributes: [], where: whereClause }],
			raw: true,
		});

		const totalSold = parseInt(totals[0].totalSold) || 0;
		const totalRevenue = parseFloat(totals[0].totalRevenue) || 0;

		// Top 10 most sold products
		const topSoldProducts = await OrderItem.findAll({
			attributes: [
				"productId",
				[sequelize.fn("SUM", sequelize.col("quantity")), "totalSold"],
			],
			include: [
				{
					model: Product,
					attributes: ["name", "price", "image"],
				},
				{ model: Order, attributes: [], where: whereClause },
			],
			group: ["productId", "Product.id"],
			order: [[sequelize.literal('"totalSold"'), "DESC"]],
			limit: 10,
			raw: true,
		});

		// const totalUserRegistered = await User.findAll({
		// 	attributes: [
		// 		[sequelize.fn("COUNT", sequelize.col("id")), "totalUsers"],
		// 	],
		// 	where: whereClause,
		// 	raw: true,
		// });

		// const totalProductsAdded = await Product.findAll({
		// 	attributes: [
		// 		[sequelize.fn("COUNT", sequelize.col("id")), "totalProducts"],
		// 	],
		// 	where: whereClause,
		// 	raw: true,
		// });

		const totalCategories = await Category.findAll({
			attributes: [
				[sequelize.fn("COUNT", sequelize.col("id")), "totalCategories"],
			],
			raw: true,
		});

		const totalOrders = await Order.findAll({
			attributes: [
				[sequelize.fn("COUNT", sequelize.col("id")), "totalOrders"],
			],
			where: whereClause,
			raw: true,
		});

		res.status(200).json({
			success: true,
			data: {
				totalRevenue: totalRevenue || 0,
				totalSold: totalSold || 0,
				// totalUsersRegistered: totalUserRegistered[0].totalUsers || 0,
				// totalProductsAdded: totalProductsAdded[0].totalProducts || 0,
				totalCategories: totalCategories[0].totalCategories || 0,
				totalOrders: totalOrders[0].totalOrders || 0,
				topSoldProducts,
			},
		});
	} catch (error) {
		console.error("Error generating summary report:", error);
		res.status(500).json({ message: "Failed to generate summary report" });
	}
};

const getTotalOrderDeliveryStatus = async (req, res) => {
	try {
		const [results] = await sequelize.query(`
  SELECT "deliveryStatus", COUNT(*) AS "count"
  FROM "Orders"
  GROUP BY "deliveryStatus"
`);
		console.log(results);

		res.status(200).json({ success: true, data: results });
	} catch (error) {
		console.error("Error fetching order status summary:", error);
		res.status(500).json({
			message: "Failed to fetch order status summary",
		});
	}
};

export default {
	getDayWiseReport,
	getSummaryReport,
	getTotalOrderDeliveryStatus,
};
