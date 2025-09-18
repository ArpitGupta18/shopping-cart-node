import { Sequelize } from "sequelize";
import { DB_NAME, DB_USER, DB_PASS, DB_HOST } from "./env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
	host: DB_HOST,
	dialect: "postgres",
	logging: false,
});

export default sequelize;
