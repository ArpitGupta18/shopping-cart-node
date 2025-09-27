import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Order = sequelize.define("Order", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	totalPrice: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	paymentStatus: {
		type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
		defaultValue: "pending",
	},
	deliveryStatus: {
		type: DataTypes.ENUM(
			"pending",
			"processing",
			"shipped",
			"delivered",
			"cancelled"
		),
		defaultValue: "pending",
	},
});

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

export default Order;
