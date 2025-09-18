import express from "express";
import order from "../controllers/order.controller.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders:
 *  post:
 *    summary: Place a new order
 *    tags: [Orders]
 *    security:
 *     - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [items]
 *            properties:
 *              items:
 *                type: array
 *                items:
 *                  type: object
 *                  required: [productId, quantity]
 *                  properties:
 *                    productId:
 *                      type: string
 *                    quantity:
 *                      type: integer
 *    responses:
 *      201:
 *        description: Order placed successfully
 */
router.post("/", requireAuth, requireRole("user"), order.placeOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *      summary: Get all orders for the authenticated user
 *      tags: [Orders]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: List of orders
 *
 */
router.get("/", requireAuth, requireRole("user"), order.getMyOrders);

/**
 * @swagger
 * /orders/all:
 *  get:
 *   summary: Get all orders (admin only)
 *   tags: [Orders]
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    200:
 *     description: List of all orders
 *    403:
 *     description: Forbidden (admin only)
 */
router.get("/all", requireAuth, requireRole("admin"), order.getAllOrders);

export default router;
