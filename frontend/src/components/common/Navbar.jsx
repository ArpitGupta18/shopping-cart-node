import React, { use } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const Navbar = () => {
	const { user, logout } = useAuth();
	return (
		<nav className="bg-gray-900 text-white px-20 py-3 flex justify-between items-center">
			<Link to="/" className="text-lg font-bold">
				Shop
			</Link>
			<div className="flex gap-4 items-center">
				{!user && (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
					</>
				)}

				{user?.role === "user" && (
					<>
						<Link to="/cart">Cart</Link>
						<span>Hello, {user.name}</span>
						<button
							onClick={logout}
							className="bg-red-500 px-3 py-1 rounded"
						>
							Logout
						</button>
					</>
				)}

				{user?.role === "admin" && (
					<>
						<Link to="/admin">Dashboard</Link>
						<span>Admin: {user.name}</span>
						<button
							onClick={logout}
							className="bg-red-500 px-3 py-1 rounded"
						>
							Logout
						</button>
					</>
				)}
			</div>
			{/* <ul className="flex space-x-7">
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/login">Login</Link>
				</li>
				<li>
					<Link to="/register">Register</Link>
				</li>
				<li>
					<Link to="/cart">Cart</Link>
				</li>
				<li>
					<Link to="/checkout">Checkout</Link>
				</li>
				<li>
					<Link to="/admin">Admin</Link>
				</li>
			</ul> */}
		</nav>
	);
};

export default Navbar;
