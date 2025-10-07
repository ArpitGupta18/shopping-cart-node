import { createContext, useState, useEffect } from "react";
import orderService from "../services/orderService";
import { useAuth } from "../hooks/useAuth";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			if (!user || user.role === "admin") {
				setOrders([]);
				return;
			}
			const data = await orderService.getUserOrder();
			setOrders(data);
		};

		fetchOrders();
	}, []);

	return (
		<OrderContext.Provider value={{ orders, setOrders }}>
			{children}
		</OrderContext.Provider>
	);
};
