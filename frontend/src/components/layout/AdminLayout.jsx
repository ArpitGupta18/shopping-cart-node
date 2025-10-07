import React from "react";

const AdminLayout = ({ children }) => {
	return (
		<div>
			<h3>Admin Dashboard</h3>
			<>{children}</>
		</div>
	);
};

export default AdminLayout;
