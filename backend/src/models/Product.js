import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Category from "./Category.js";

const Product = sequelize.define("Product", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	stock: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	image: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

Product.belongsTo(Category, {
	foreignKey: { name: "categoryId", allowNull: true },
	onDelete: "SET NULL",
});
Category.hasMany(Product, { foreignKey: "categoryId" });

export default Product;
