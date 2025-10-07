import { createContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import cartService from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const { user } = useAuth();
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		const fetchCart = async () => {
			if (!user || user.role === "admin") {
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

	const cartTotal = cartItems.reduce(
		(sum, item) => sum + item.Product.price * item.quantity,
		0
	);

	return (
		<CartContext.Provider
			value={{
				cartItems,
				setCartItems,
				cartCount,
				refreshCart,
				cartTotal,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
