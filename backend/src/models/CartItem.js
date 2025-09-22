import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Cart from "./Cart.js";
import Product from "./Product.js";

const CartItem = sequelize.define("CartItem", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
	},
});

Cart.hasMany(CartItem, {
	foreignKey: "cartId",
	onDelete: "CASCADE",
	hooks: true,
});
CartItem.belongsTo(Cart, { foreignKey: "cartId", onDelete: "CASCADE" });

Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

export default CartItem;
