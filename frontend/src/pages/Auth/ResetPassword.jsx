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
		<div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<h2 className="text-2xl font-bold mb-4">Reset Password</h2>
				<input
					type="password"
					placeholder="New Password"
					className="border rounded-md border-gray-500 p-2"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Confirm Password"
					className="border rounded-md border-gray-500 p-2"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
				<button className="bg-blue-500 text-white px-4 py-2 rounded">
					Reset Password
				</button>
			</form>
		</div>
	);
};

export default ResetPassword;
