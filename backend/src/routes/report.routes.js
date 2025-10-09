import express from "express";
import report from "../controllers/report.controller.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reporting endpoints
 */

/**
 * @swagger
 * /report/daywise:
 *   get:
 *     summary: Get day-wise sales and revenue report
 *     description: Returns total number of products sold and total revenue generated for each day. Accessible only by admin users.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional start date (YYYY-MM-DD)
 *         example: "2025-09-01"
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional end date (YYYY-MM-DD)
 *         example: "2025-10-10"
 *     responses:
 *       200:
 *         description: Successfully fetched day-wise report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-10-01"
 *                       totalSold:
 *                         type: integer
 *                         example: 12
 *                       totalRevenue:
 *                         type: number
 *                         format: float
 *                         example: 4500.75
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       403:
 *         description: Forbidden – only admin can access this route
 *       404:
 *         description: No sales data found
 *       500:
 *         description: Server error
 */
router.get(
	"/daywise",
	// requireAuth,
	// requireRole("admin"),
	report.getDayWiseReport
);

/**
 * @swagger
 * /report/summary:
 *   get:
 *     summary: Get total analytics summary (sales, revenue, top sold products)
 *     description: Returns total revenue, total products sold, and top 10 best-selling products. Accessible only by admin.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional start date (YYYY-MM-DD)
 *         example: "2025-09-01"
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: Optional end date (YYYY-MM-DD)
 *         example: "2025-10-10"
 *     responses:
 *       200:
 *         description: Successfully fetched summary report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                       example: 24600
 *                     totalSales:
 *                       type: integer
 *                       example: 78
 *                     topSoldProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "b21d..."
 *                           totalSold:
 *                             type: string
 *                             example: "25"
 *                           Product.name:
 *                             type: string
 *                             example: "School Bag"
 *                           Product.price:
 *                             type: number
 *                             example: 1500
 *                           Product.image:
 *                             type: string
 *                             example: "https://res.cloudinary.com/.../school-bag.jpg"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Server error
 */

router.get(
	"/summary",
	// requireAuth,
	// requireRole("admin"),
	report.getSummaryReport
);

/**
 * @swagger
 * /report/delivery-status:
 *   get:
 *     summary: Get total number of orders by delivery status
 *     description: |
 *       Returns a count of orders grouped by their delivery status (e.g., Pending, Shipped, Delivered, Cancelled).
 *       Optionally filters the results by a start and end date to limit the range of orders considered.
 *       Accessible only by admin users.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Optional start date (YYYY-MM-DD) — include orders created on or after this date.
 *         example: "2025-10-01"
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Optional end date (YYYY-MM-DD) — include orders created up to this date.
 *         example: "2025-10-07"
 *     responses:
 *       200:
 *         description: Successfully fetched order delivery status summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: List of order counts grouped by delivery status
 *                   items:
 *                     type: object
 *                     properties:
 *                       deliveryStatus:
 *                         type: string
 *                         description: Delivery status of the order
 *                         example: "Pending"
 *                       count:
 *                         type: integer
 *                         description: Total number of orders with this status
 *                         example: 8
 *       400:
 *         description: Invalid date range or query parameters
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — only admin can access this route
 *       500:
 *         description: Server error — failed to fetch order status summary
 */

router.get("/delivery-status", report.getTotalOrderDeliveryStatus);

export default router;
