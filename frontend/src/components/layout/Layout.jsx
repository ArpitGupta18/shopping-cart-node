import React from "react";
import Navbar from "../common/Navbar";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<>{children}</>
		</div>
	);
};

export default Layout;
