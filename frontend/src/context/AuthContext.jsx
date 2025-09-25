import { createContext, useEffect, useState } from "react";
import api from "../services/api.js";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem("accessToken");
			if (!token) {
				return;
			}

			try {
				const res = await api.get("/me");
				setUser(res.data.user);
			} catch (error) {
				console.error("Auth check failed:", error);
				setUser(null);
			}
		};

		fetchUser();
	}, []);

	const login = async (credentials) => {
		const res = await api.post("/auth/login", credentials);

		localStorage.setItem("accessToken", res.data.accessToken);

		const me = await api.get("/me");
		setUser(me.data.user);
		return res.data;
	};

	const register = async (data) => {
		const res = await api.post("/auth/register", data);
		return res.data;
	};

	const logout = async () => {
		await api.post("/auth/logout");
		localStorage.removeItem("accessToken");
		setUser(null);
		toast.success("Logged out successfully");
	};

	const verifyOTP = async (data) => {
		const res = await api.post("/auth/verify-otp", data);
		return res.data;
	};

	const forgetPassword = async (email) => {
		const res = await api.post("/auth/forgot-password", { email });
		return res.data;
	};

	const resetPassword = async (token, password) => {
		const res = await api.post(`/auth/reset-password/${token}`, {
			newPassword: password,
		});
		return res.data;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				register,
				logout,
				verifyOTP,
				forgetPassword,
				resetPassword,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
