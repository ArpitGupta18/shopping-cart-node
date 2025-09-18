import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

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
});

export default Product;
