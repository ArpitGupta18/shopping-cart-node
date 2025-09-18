import app from "./app.js";
import sequelize from "./config/db.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import OrderItem from "./models/OrderItem.js";
import { PORT } from "./config/env.js";

sequelize
	.sync({ alter: true })
	.then(() => {
		console.log("Database connected and models synchronized");
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Unable to connect to the database:", err);
	});
