import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PublicRoute = ({ children }) => {
	const { user } = useAuth();

	if (user?.role === "admin") {
		return <Navigate to="/admin" replace />;
	}
	if (user?.role === "user") {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default PublicRoute;
