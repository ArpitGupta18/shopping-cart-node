import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword } = useAuth();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		try {
			const data = await resetPassword(token, password);
			alert(
				"Password reset successful. Please log in with your new password."
			);
			navigate("/login");
		} catch (error) {
			console.error("Reset password failed:", error);
			alert("Failed to reset password");
		}
	};

	return (
		<div className="flex-grow grid grid-cols-1 md:grid-cols-2 bg-gray-500">
			<div className="hidden md:flex items-center justify-center p-20">
				<img
					src="/forgot-password.png"
					alt=""
					className="object-cover w-full h-full"
				/>
			</div>
			<div className="flex items-center justify-center bg-gray-50">
				<div className="w-full max-w-md">
					<h2 className="text-3xl font-bold text-gray-800 mb-8">
						Set New Password
					</h2>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-5"
					>
						<input
							type="password"
							placeholder="New Password"
							className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder="Confirm Password"
							className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
						<button className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition cursor-pointer mt-1">
							Reset Password
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
