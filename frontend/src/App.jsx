import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Products from "./pages/Products/Products";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import RestrictedRoute from "./components/common/RestrictedRoute";
import ResetPassword from "./pages/Auth/ResetPassword";
import { ToastContainer } from "react-toastify";
import Orders from "./pages/Checkout/Orders";
import { useAuth } from "./hooks/useAuth";
const App = () => {
	const { user } = useAuth();

	const LayoutComponent = user?.role === "admin" ? AdminLayout : Layout;
	return (
		<Router>
			<LayoutComponent>
				<Routes>
					<Route
						path="/"
						element={
							<RestrictedRoute disallowedRoles={["admin"]}>
								<Products />
							</RestrictedRoute>
						}
					/>
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
						path="/orders"
						element={
							<ProtectedRoute allowedRoles={["user"]}>
								<Orders />
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
					{/* <Route
						path="/admin"
						element={<ProtectedRoute allowedRoles={["admin"]} />}
					>
						<Route index element={<Dashboard />} />
					</Route> */}
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
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
				/>
			</LayoutComponent>
		</Router>
	);
};

export default App;
