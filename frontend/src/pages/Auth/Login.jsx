import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
	const location = useLocation();

	const [toastShown, setToastShown] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [forgotEmail, setForgotEmail] = useState("");
	const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
		useState(false);
	const { login, forgetPassword, refreshToken } = useAuth();
	const navigate = useNavigate();

	console.log("Location:", location);
	useEffect(() => {
		const handleAuth = async () => {
			const queryParams = new URLSearchParams(location.search);
			const error = queryParams.get("error");
			const success = queryParams.get("success");

			if ((error || success) && !toastShown) {
				setToastShown(true);

				if (error) {
					if (error === "already_registered") {
						toast.error(
							"This email is already registered. Please login with password."
						);
					} else if (error === "oauth_failed") {
						toast.error("Google login failed. Please try again.");
					}
					window.history.replaceState({}, document.title, "/login");
				}

				if (success) {
					try {
						const accessToken = await refreshToken();
						console.log("accessToken:", accessToken);
						if (accessToken) {
							toast.success("Logged in successfully via Google!");
							navigate("/");
						} else {
							toast.error("Session expired. Please login again.");
						}
					} catch {
						toast.error("Session expired. Please login again.");
					} finally {
						window.history.replaceState({}, document.title, "/");
					}
				}
			}
		};

		handleAuth();
	}, [location.search, toastShown]);

	const handleForgotPassword = async (e) => {
		e.preventDefault();

		const data = await forgetPassword(forgotEmail);
		setIsForgotPasswordModalOpen(false);
		console.log(data);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const data = await login({ email, password });

			toast.success("Login successful!");
			navigate("/");
		} catch (error) {
			if (error.status === 400) {
				toast.error("Invalid credentials");
			} else {
				toast.error("Login failed. Please try again.");
			}
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="flex-grow grid grid-cols-1 md:grid-cols-2 bg-gray-500">
			<div className="hidden md:flex items-center justify-center p-20">
				<img
					src="/login-registration.png"
					alt=""
					className="object-cover w-full h-full"
				/>
			</div>
			<div className="flex items-center justify-center bg-gray-50">
				<div className="w-full max-w-md">
					<h2 className="text-3xl font-bold text-gray-800 mb-8">
						Welcome Back
					</h2>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-5"
					>
						<input
							type="email"
							placeholder="Email"
							className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Password"
							className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition cursor-pointer mt-1">
							Login
						</button>
					</form>

					<div className="flex justify-between items-center mt-6 text-sm">
						<button
							className="text-indigo-600 hover:underline"
							onClick={() => setIsForgotPasswordModalOpen(true)}
						>
							Forgot Password?
						</button>
						<Link
							to="/register"
							className="text-indigo-600 hover:underline"
						>
							Create an account
						</Link>
					</div>

					<div className="mt-8 flex items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="mx-4 text-gray-500 text-sm">
							Or login with
						</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<div className="mt-6 flex justify-center gap-4">
						<a
							href={`${
								import.meta.env.VITE_BASE_URL
							}/auth/google`}
							className="flex items-center justify-center w-12 h-12 rounded-full transition cursor-pointer border-1 text-indigo-600 hover:text-white border-gray-300 hover:bg-indigo-600 "
						>
							<FaGoogle className="h-6 w-6 " />
						</a>
					</div>
				</div>
			</div>

			{isForgotPasswordModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div
						className="absolute inset-0 bg-black/80"
						onClick={() => setIsForgotPasswordModalOpen(false)}
					></div>

					<div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8 z-10">
						<h2 className="text-2xl font-semibold text-gray-800 mb-3">
							Forgot Password
						</h2>
						<p className="text-sm text-gray-600 mb-6">
							Enter your email address and we’ll send you a link
							to reset your password.
						</p>

						<form
							onSubmit={handleForgotPassword}
							className="space-y-4"
						>
							<input
								type="email"
								placeholder="Email"
								className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
								value={forgotEmail}
								onChange={(e) => setForgotEmail(e.target.value)}
								required
							/>

							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
									onClick={() =>
										setIsForgotPasswordModalOpen(false)
									}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
								>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Login;
