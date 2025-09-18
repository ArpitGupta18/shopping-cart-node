import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define("User", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	role: {
		type: DataTypes.ENUM("user", "admin"),
		defaultValue: "user",
	},
	refreshToken: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	isVerified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	otp: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	otpExpiry: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	resetToken: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	resetTokenExpiry: {
		type: DataTypes.DATE,
		allowNull: true,
	},
});

export default User;
