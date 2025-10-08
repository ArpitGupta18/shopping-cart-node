import Sidebar from "../common/Sidebar";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const location = useLocation();

	const getPageTitle = (pathname) => {
		if (pathname === "/admin") return "Dashboard Overview";
		if (pathname.includes("/admin/products")) return "Manage Products";
		if (pathname.includes("/admin/categories")) return "Manage Categories";
		if (pathname.includes("/admin/orders")) return "Orders & Transactions";
		return "Admin Panel";
	};
	return (
		<div className="h-screen flex bg-gray-100 overflow-hidden">
			<Sidebar
				isCollapsed={isCollapsed}
				setIsCollapsed={setIsCollapsed}
			/>
			<div
				className={`flex-1 flex flex-col transition-all duration-300 ${
					isCollapsed ? "ml-20" : "ml-64"
				}`}
			>
				<header className="bg-white shadow flex items-center justify-between px-6 py-4 sticky top-0 z-10">
					<h2 className="text-xl font-semibold text-gray-800">
						{getPageTitle(location.pathname)}
					</h2>
					<span className="text-gray-700 text-sm">
						Welcome, Admin 👋
					</span>
				</header>
				<main className="flex-1 overflow-y-auto p-6">{children}</main>
			</div>
		</div>
	);
};

export default AdminLayout;
