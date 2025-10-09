import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	Package,
	Folder,
	ShoppingCart,
	LogOut,
	Menu,
	X,
} from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
	const { logout } = useAuth();

	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	const navItems = [
		{
			name: "Dashboard",
			path: "/admin",
			icon: <LayoutDashboard size={20} />,
		},
		{
			name: "Products",
			path: "/admin/products",
			icon: <Package size={20} />,
		},
		{
			name: "Categories",
			path: "/admin/categories",
			icon: <Folder size={20} />,
		},
		{
			name: "Orders",
			path: "/admin/orders",
			icon: <ShoppingCart size={20} />,
		},
	];

	console.log(navItems);
	return (
		<aside
			className={`${
				isCollapsed ? "w-20" : "w-64"
			} bg-gray-900 text-white flex flex-col fixed h-screen transition-all duration-300 z-11`}
		>
			<div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
				{!isCollapsed && (
					<h1 className="text-lg font-semibold transition-all duration-300 w-auto">
						NeoCart
					</h1>
				)}

				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="text-gray-300 hover:text-white"
				>
					{isCollapsed ? (
						<Menu
							size={24}
							className="ml-1 my-0.5 cursor-pointer"
						/>
					) : (
						<X size={20} className="cursor-pointer" />
					)}
				</button>
			</div>

			<nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
				{navItems.map((item) => {
					return (
						<NavLink
							key={item.path}
							to={item.path}
							end
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
									isActive
										? "bg-gray-800 text-white font-medium"
										: "text-gray-300 hover:bg-gray-800 hover:text-white"
								}`
							}
						>
							{item.icon}
							<span
								className={`text-sm transition-all duration-200 ${
									isCollapsed
										? "opacity-0 w-0 hidden"
										: "opacity-100 w-auto ml-4"
								}`}
							>
								{item.name}
							</span>
						</NavLink>
					);
				})}
			</nav>
			<div className="px-4 py-4 border-t border-gray-700">
				<button
					onClick={handleLogout}
					className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-600 text-white px-3 py-2.5 rounded-md transition-all cursor-pointer"
				>
					<LogOut size={18} /> {!isCollapsed && <span>Logout</span>}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
