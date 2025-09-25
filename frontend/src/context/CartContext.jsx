import { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import cartService from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const { user } = useAuth();
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		const fetchCart = async () => {
			if (!user) {
				setCartItems([]);
				return;
			}
			try {
				const data = await cartService.getCart();
				console.log(data.cart?.CartItems);
				setCartItems(data.cart?.CartItems || []);
			} catch (error) {
				console.error("Failed to fetch cart:", error);
			}
		};
		fetchCart();
	}, [user]);

	const cartCount = cartItems.reduce(
		(total, item) => total + item.quantity,
		0
	);

	const refreshCart = async () => {
		const data = await cartService.getCart();
		setCartItems(data.cart?.CartItems || []);
	};
	return (
		<CartContext.Provider
			value={{ cartItems, setCartItems, cartCount, refreshCart }}
		>
			{children}
		</CartContext.Provider>
	);
};
