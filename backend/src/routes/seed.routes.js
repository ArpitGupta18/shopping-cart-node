import express from "express";
import seed from "../controllers/seed.controller.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seed
 *   description: Database seeding endpoints
 */

/**
 * @swagger
 * /seed/products:
 *   post:
 *     summary: Seed the database with initial products
 *     tags: [Seed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Products seeded successfully
 *       500:
 *         description: Server error
 */
router.post("/products", requireAuth, requireRole("admin"), seed.seedProducts);

export default router;
