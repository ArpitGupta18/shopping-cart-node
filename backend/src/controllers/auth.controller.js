import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
	JWT_SECRET,
	JWT_REFRESH_SECRET,
	EMAIL_USER,
	FRONTEND_URL,
	NODE_ENV,
} from "../config/env.js";
import { transporter } from "../config/email.js";

const generateAccessToken = (user) => {
	return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
		expiresIn: "60m",
	});
};

const generateRefreshToken = (user) => {
	return jwt.sign({ id: user.id, role: user.role }, JWT_REFRESH_SECRET, {
		expiresIn: "7d",
	});
};

const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ message: "All fields are required." });
		}

		if (password.length < 8) {
			return res
				.status(400)
				.json({ message: "Password must be at least 8 characters." });
		}
		const existingUser = await User.findOne({ where: { email } });

		if (existingUser) {
			return res.status(400).json({ message: "Email already in use" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const otp = Math.floor(100000 + Math.random() * 900000).toString();
		const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			otp,
			otpExpiry,
			isVerified: false,
		});

		await transporter.sendMail({
			from: EMAIL_USER,
			to: user.email,
			subject: "Verify your email",
			text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
		});

		res.status(201).json({
			message: "User registered. Please verify OTP.",
		});
	} catch (error) {
		console.error("Error during user registration:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const user = await User.findOne({ where: { email } });

		if (!user.isVerified) {
			return res
				.status(403)
				.json({ error: "Please verify your email first" });
		}

		if (!user)
			return res.status(400).json({ error: "Invalid credentials" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ error: "Invalid credentials" });

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		user.refreshToken = refreshToken;
		await user.save();

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({ accessToken, refreshToken });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const refreshToken = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken)
		return res.status(401).json({ error: "Refresh token required" });

	try {
		const user = await User.findOne({ where: { refreshToken } });
		if (!user) {
			return res.status(403).json({ error: "Invalid refresh token" });
		}

		jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
			if (err) {
				return res.status(403).json({ error: "Invalid refresh token" });
			}

			const newAccessToken = generateAccessToken(user);
			res.json({ accessToken: newAccessToken });
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		console.log("Logout refresh token:", refreshToken);
		if (!refreshToken) {
			return res.status(401).json({ error: "Refresh token required" });
		}

		const user = await User.findOne({ where: { refreshToken } });

		if (!user) {
			return res.status(403).json({ error: "Invalid refresh token" });
		}

		user.refreshToken = null;
		await user.save();

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
		});
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const verifyOtp = async (req, res) => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		if (user.isVerified) {
			return res.status(400).json({ error: "User already verified" });
		}

		if (user.otp !== otp || user.otpExpiry < new Date()) {
			return res.status(400).json({ error: "Invalid or expired OTP" });
		}

		user.isVerified = true;
		user.otp = null;
		user.otpExpiry = null;
		await user.save();

		res.json({
			message: "Email verified successfully. You can log in now",
			user: {
				name: user.name,
				role: user.role,
				email: user.email,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}

		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

		user.resetToken = resetToken;
		user.resetTokenExpiry = resetTokenExpiry;

		await user.save();

		const resetUrl = `${FRONTEND_URL}/auth/reset-password/${resetToken}`;

		await transporter.sendMail({
			from: EMAIL_USER,
			to: user.email,
			subject: "Password Reset",
			text: `${resetUrl}. This token will expire in 1 hour.`,
		});

		res.json({
			message: "Password reset link sent to your email",
			resetToken,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const resetPassword = async (req, res) => {
	const { resetToken } = req.params;
	const { newPassword } = req.body;

	console.log(resetToken);

	if (!newPassword) {
		return res.status(400).json({ error: "New password is required" });
	}

	const user = await User.findOne({ where: { resetToken } });

	if (!user) {
		return res
			.status(400)
			.json({ error: "Invalid or expired reset token" });
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);
	user.password = hashedPassword;

	user.resetToken = null;
	user.resetTokenExpiry = null;

	await user.save();

	res.json({ message: "Password has been reset successfully" });
};

export default {
	register,
	login,
	refreshToken,
	logout,
	verifyOtp,
	forgotPassword,
	resetPassword,
};
