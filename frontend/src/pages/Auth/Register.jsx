import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
			alert("Please enter the OTP");
			return;
		}

		try {
			const data = await verifyOTP({ email, otp });
			console.log("OTP:", data);
			if (!!data.message) {
				alert("OTP verified successfully");
				setVerifyModal(false);
				navigate("/login");
			} else {
				alert("OTP verification failed");
				return;
			}
		} catch (error) {
			console.error("OTP verification failed:", error);
			alert("Invalid OTP");
			return;
		}
	};

	return (
		<>
			<div>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<input
						type="text"
						placeholder="Full Name"
						className="border rounded-md border-gray-500 p-2"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="email"
						placeholder="Email"
						className="border rounded-md border-gray-500 p-2"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Password"
						className="border rounded-md border-gray-500 p-2"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Confirm Password"
						className="border rounded-md border-gray-500 p-2"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<button className="bg-blue-500 text-white px-4 py-2 rounded">
						Register
					</button>
				</form>
			</div>
			{verifyModal && (
				<div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center">
					<div className="bg-white p-6 rounded shadow-lg">
						<h2 className="text-xl mb-4">Verify OTP</h2>
						<p className="mb-4">
							Please check your email for the OTP to verify your
							account.
						</p>
						<form onSubmit={handleOTP} className="flex flex-col">
							<input
								type="text"
								placeholder="Enter OTP"
								className="border rounded-md border-gray-500 p-2 mb-4"
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
							/>
							<button className="bg-blue-500 text-white px-4 py-2 rounded">
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
		</>
	);
};

export default Register;
