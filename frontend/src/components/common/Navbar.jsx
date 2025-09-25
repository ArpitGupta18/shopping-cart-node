import React, { use } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { ShoppingBagIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
	const { user, logout } = useAuth();
	const { cartCount } = useCart();

	return (
		<nav className="bg-gray-900 text-white px-20 py-3 flex justify-between items-center">
			<Link to="/" className="text-lg font-bold">
				NeoCart
			</Link>
			<div className="flex gap-7 items-center">
				{user?.role !== "admin" && (
					<Link to="/" className="hover:text-indigo-400 transition">
						Products
					</Link>
				)}

				{!user && (
					<>
						<Link
							to="/login"
							className="hover:text-indigo-400 transition"
						>
							Login
						</Link>
						<Link
							to="/register"
							className="hover:text-indigo-400 transition"
						>
							Register
						</Link>
					</>
				)}

				{user?.role === "user" && (
					<>
						<Link to="/cart" className="relative group">
							<ShoppingBagIcon className="h-6 w-6 text-white hover:text-indigo-400 transition" />
							{cartCount > 0 && (
								<span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white font-bold px-1.5 py-0.5 rounded-full">
									{cartCount}
								</span>
							)}
							<span className="absolute left-1/2 -translate-x-1/2 top-9 scale-0 group-hover:scale-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded">
								View Cart
							</span>
						</Link>

						<div className="relative group">
							<UserCircleIcon className="h-7 w-7 text-white hover:text-indigo-400 cursor-pointer" />
							<div
								className="absolute right-0 -mt-1 -mr-5 w-40 bg-white text-gray-800 rounded-lg shadow-lg 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                group-hover:translate-y-1 transition-all duration-200 transform p-2"
							>
								<div className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
									Hi, {user.name}
								</div>
								<button
									onClick={logout}
									className="w-full mt-2 bg-red-500 text-white py-2 rounded-md border-1 border-neutral-600 text-sm hover:bg-red-600 transition cursor-pointer"
								>
									Logout
								</button>
							</div>
						</div>
					</>
				)}

				{user?.role === "admin" && (
					<>
						<Link
							to="/admin"
							className="hover:text-indigo-400 transition"
						>
							Dashboard
						</Link>
						<div className="relative group">
							<UserCircleIcon className="h-7 w-7 text-white hover:text-indigo-400 cursor-pointer" />
							<div
								className="absolute right-0 -mt-1 -mr-5 w-40 bg-white text-gray-800 rounded-lg shadow-lg 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                group-hover:translate-y-1 transition-all duration-200 transform p-2"
							>
								<div className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
									Hi, {user.name}
								</div>
								<button
									onClick={logout}
									className="w-full mt-2 bg-red-500 text-white py-2 rounded-md border-1 border-neutral-600 text-sm hover:bg-red-600 transition cursor-pointer"
								>
									Logout
								</button>
							</div>
						</div>
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
