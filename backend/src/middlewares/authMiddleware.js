import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized, token missing" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const user = await User.findByPk(decoded.id, {
			attributes: ["id", "name", "email", "role", "isVerified"],
		});
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Unauthorized, token invalid" });
	}
};

export const requireRole = (role) => {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: "Unauthorized" });
		if (req.user.role !== role) {
			return res
				.status(403)
				.json({ error: "Forbidden insufficient role" });
		}
		next();
	};
};
