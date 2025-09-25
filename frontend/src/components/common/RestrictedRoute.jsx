import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

const RestrictedRoute = ({ children, disallowedRoles = [] }) => {
	const { user } = useAuth();

	if (user && disallowedRoles.includes(user.role)) {
		return <Navigate to="/admin" replace />;
	}

	return children;
};

export default RestrictedRoute;
