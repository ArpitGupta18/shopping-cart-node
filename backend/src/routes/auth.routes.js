import express from "express";
import auth from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import { FRONTEND_URL, NODE_ENV } from "../config/env.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: Register a new user
 *    description: Register a new user with name, email, and password.
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [name, email, password]
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *       201:
 *         description: User registered successfully
 *
 */
router.post("/register", auth.register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Login a user
 *    description: Login a user with email and password.
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [email, password]
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login", auth.login);

/**
 * @swagger
 * /auth/refresh:
 *  post:
 *    summary: Refresh access token
 *    description: Refresh the access token using the refresh token.
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required: [refreshToken]
 *            properties:
 *              refreshToken:
 *                type: string
 *    responses:
 *       200:
 *         description: Access token refreshed successfully
 */
router.post("/refresh", auth.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *  post:
 *   summary: Logout a user
 *   description: Logout a user by invalidating the refresh token.
 *   tags: [Auth]
 *   responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Refresh token required
 *       403:
 *         description: Invalid refresh token
 */
router.post("/logout", auth.logout);

/**
 * @swagger
 * /auth/verify-otp:
 *  post:
 *   summary: Verify account with OTP
 *   description: Verify a user's account using the OTP sent to their email.
 *   tags: [Auth]
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required: [email, otp]
 *           properties:
 *             email:
 *               type: string
 *             otp:
 *               type: string
 *   responses:
 *     200:
 *       description: Email verified successfully. You can log in now
 *     400:
 *        description: Invalid OTP or OTP expired / User already verified
 *     404:
 *        description: User not found
 */
router.post("/verify-otp", auth.verifyOtp);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 */
router.post("/forgot-password", auth.forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{resetToken}:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password/:resetToken", auth.resetPassword);

/**
 * @swagger
 * /auth/google:
 *  get:
 *    summary: Login with Google
 *    description: Redirects to Google OAuth login page.
 *    tags: [Auth]
 *    responses:
 *      302:
 *        description: Redirect to Google
 */
router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *  get:
 *    summary: Google OAuth callback
 *    description: Handles the Google OAuth callback. Redirects the user back to frontend with session or JWT.
 *    tags: [Auth]
 *    parameters:
 *      - in: query
 *        name: code
 *        schema:
 *          type: string
 *        description: Authorization code returned by Google
 *    responses:
 *      302:
 *        description: Redirect to frontend after successful login
 *      401:
 *        description: Authentication failed
 */
router.get("/google/callback", (req, res, next) => {
	passport.authenticate("google", async (err, user, info) => {
		if (err || !user) {
			// if login fails → redirect with message
			const errorMessage = info?.message || "oauth_failed";
			return res.redirect(
				`${FRONTEND_URL}/login?error=${encodeURIComponent(
					errorMessage
				)}`
			);
		}

		try {
			// ** Generate tokens
			// ! Is the access token generation necessary over here
			const accessToken = jwt.sign(
				{ id: user.id, role: user.role },
				process.env.JWT_SECRET,
				{ expiresIn: "60m" }
			);

			const refreshToken = jwt.sign(
				{ id: user.id },
				process.env.JWT_REFRESH_SECRET,
				{ expiresIn: "7d" }
			);

			// ** Save refreshToken in DB
			user.refreshToken = refreshToken;
			await user.save();

			// ** Set refreshToken as HTTP-only cookie
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			// ** Redirect to frontend with accessToken in URL
			res.redirect(`${FRONTEND_URL}/login?success=google_login`);
		} catch (error) {
			console.error("Error issuing tokens:", error);
			return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
		}
	})(req, res, next);
});

export default router;
