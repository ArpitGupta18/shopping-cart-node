import { createContext, useState, useEffect } from "react";
import orderService from "../services/orderService";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
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
