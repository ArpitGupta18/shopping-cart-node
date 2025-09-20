import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cookieParser from "cookie-parser";
import path from "path";
import serveIndex from "serve-index";
import { UPLOAD_DIR } from "./config/env.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import seedRoutes from "./routes/seed.routes.js";

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:3000"],
		credentials: true,
	})
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Shopping Cart API",
			version: "1.0.0",
			description: "API documentation for the Shopping Cart application",
		},
		servers: [
			{
				url: "http://localhost:3000",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: ["src/routes/*.js"],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/", healthRoutes);
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/seed", seedRoutes);
app.use(
	"/uploads",
	express.static(path.join(process.cwd(), UPLOAD_DIR)),
	serveIndex(UPLOAD_DIR, { icons: true })
);

export default app;
