import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const Register = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [verifyModal, setVerifyModal] = useState(false);
	const { register, verifyOTP } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		try {
			setLoading(true);
			await register({ name, email, password });
			setLoading(false);
			setVerifyModal(true);
		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	const handleOTP = async (e) => {
		e.preventDefault();

		if (otp === "") {
			toast.warning("Please enter the OTP");
			return;
		}

		try {
			const data = await verifyOTP({ email, otp });
			console.log("OTP:", data);
			if (!!data.message) {
				toast.success("Registration Successful! Please login.");
				setVerifyModal(false);
				navigate("/login");
			} else {
				toast.error("OTP verification failed");
				return;
			}
		} catch (error) {
			console.error("OTP verification failed:", error);
			toast.error("Invalid OTP");
			return;
		}
	};

	return (
		<div className="flex-grow grid grid-cols-1 md:grid-cols-2 bg-gray-500">
			<div className="flex items-center justify-center bg-gray-50">
				<div className="w-full max-w-md">
					<h2 className="text-3xl font-bold text-gray-800 mb-8">
						Create an Account
					</h2>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-5"
					>
						<input
							type="text"
							placeholder="Full Name"
							className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
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
						<input
							type="password"
							placeholder="Confirm Password"
							className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition cursor-pointer mt-1">
							Register
						</button>
					</form>

					<div className="flex justify-center items-center mt-7 text-sm">
						<Link
							to="/login"
							className="text-indigo-600 hover:underline"
						>
							Already have an account? Log in
						</Link>
					</div>
				</div>
			</div>

			<div className="hidden md:flex items-center justify-center p-20">
				<img
					src="/register-illustration.png"
					className="object-cover w-full h-full"
				/>
			</div>
			{verifyModal && (
				<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
						<h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
							Verify Your Account
						</h2>
						<p className="text-gray-600 text-sm text-center mb-6">
							Enter the OTP sent to{" "}
							<span className="font-medium">{email}</span>
						</p>

						<form
							onSubmit={handleOTP}
							className="flex flex-col gap-4"
						>
							<input
								type="text"
								placeholder="Enter 6-digit OTP"
								className="border border-gray-300 rounded-lg px-4 py-3 text-center text-lg tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
							/>

							<button
								type="submit"
								className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
							>
								Verify OTP
							</button>
						</form>
					</div>
				</div>
			)}

			{loading && (
				<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black/95 flex items-center justify-center z-50">
					<div className="flex flex-col items-center gap-6">
						<div className="flex space-x-3">
							<div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
							<div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
							<div className="w-4 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></div>
						</div>

						<p className="text-white text-lg font-semibold tracking-wider animate-pulse">
							Generating OTP
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Register;
