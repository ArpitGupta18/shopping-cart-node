import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [forgotEmail, setForgotEmail] = useState("");
	const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
		useState(false);
	const { login, forgetPassword } = useAuth();
	const navigate = useNavigate();

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
			console.log(data);
			console.log("here");
			navigate("/");
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
				<button className="bg-blue-500 text-white px-4 py-2 rounded">
					Login
				</button>
			</form>

			<button
				className="text-blue-600 mt-3"
				onClick={() => setIsForgotPasswordModalOpen(true)}
			>
				Forgot Password?
			</button>

			{isForgotPasswordModalOpen && (
				<div className="fixed inset-0 bg-black opacity-80 flex items-center justify-center">
					<form
						onSubmit={handleForgotPassword}
						className="bg-white p-6 rounded shadow-md"
					>
						<h2 className="text-xl mb-4">Forgot Password</h2>
						<p>Enter your email to reset your password.</p>
						<input
							type="email"
							placeholder="Email"
							className="border rounded-md border-gray-500 p-2 w-full mt-2"
							value={forgotEmail}
							onChange={(e) => setForgotEmail(e.target.value)}
							required
						/>
						<div className="mt-4 flex justify-end gap-2">
							<button
								className="bg-gray-300 px-4 py-2 rounded"
								onClick={() =>
									setIsForgotPasswordModalOpen(false)
								}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="bg-blue-500 text-white px-4 py-2 rounded"
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default Login;
