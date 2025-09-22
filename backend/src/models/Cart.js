import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Cart = sequelize.define("Cart", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
});

Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasOne(Cart, { foreignKey: "userId" });

export default Cart;
