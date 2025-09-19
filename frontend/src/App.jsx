import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Products from "./pages/Products/Products";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import ResetPassword from "./pages/Auth/ResetPassword";

const App = () => {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<Products />} />
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path="/register"
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>
					<Route
						path="/cart"
						element={
							<ProtectedRoute allowedRoles={["user"]}>
								<Cart />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/checkout"
						element={
							<ProtectedRoute allowedRoles={["user"]}>
								<Checkout />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin"
						element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/auth/reset-password/:token"
						element={<ResetPassword />}
					/>
				</Routes>
			</Layout>
		</Router>
	);
};

export default App;
