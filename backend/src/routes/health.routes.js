import express from "express";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Example protected route (user)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/protected", requireAuth, (req, res) => {
	res.json({ message: "You are authenticated!", user: req.user });
});

/**
 * @swagger
 * /admin-only:
 *   get:
 *     summary: Example admin-only route
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/admin-only", requireAuth, requireRole("admin"), (req, res) => {
	res.json({ message: "Hello Admin!", user: req.user });
});

export default router;
