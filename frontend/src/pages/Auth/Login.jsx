import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useAuth();
	const navigate = useNavigate();

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
		</div>
	);
};

export default Login;
