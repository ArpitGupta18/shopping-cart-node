import React from "react";
import { useCart } from "../../hooks/useCart";
import cartService from "../../services/cartService";
import { TrashIcon } from "@heroicons/react/24/outline";
import orderService from "../../services/orderService";
import { toast } from "react-toastify";

const Cart = () => {
	const { cartItems, setCartItems } = useCart();

	const placeOrder = async () => {
		try {
			await orderService.placeOrder();
			setCartItems([]);
			toast.success("Order placed successfully!");
		} catch (error) {
			toast.error("Failed to place order.");
		}
	};

	const removeItem = async (cartItemId) => {
		try {
			await cartService.deleteCartItem(cartItemId);
			setCartItems((prev) =>
				prev.filter((item) => item.id !== cartItemId)
			);
		} catch (error) {
			console.error("Failed to remove item from cart:", error);
		}
	};

	const clearCart = async () => {
		try {
			await cartService.clearCart();
			setCartItems([]);
		} catch (error) {
			console.error("Failed to clear cart:", error);
		}
	};

	const updateQuantity = async (cartItemId, newQuantity) => {
		try {
			const res = await cartService.updateCartItem(
				cartItemId,
				newQuantity
			);

			if (res.cart) {
				setCartItems(res.cart.CartItems);
			} else {
				setCartItems((prev) =>
					prev.filter((item) => item.id !== cartItemId)
				);
			}
		} catch (error) {
			console.error("Failed to update item quantity:", error);
		}
	};

	if (!cartItems || cartItems.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-screen px-6 bg-white rounded-xl shadow-sm border border-gray-200">
				<div className="text-6xl mb-4">🛒</div>

				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					Your cart is empty
				</h2>
				<p className="text-gray-500 text-center max-w-md">
					Looks like you haven’t added anything yet. Start exploring
					our products and add your favorites to the cart!
				</p>

				<button
					onClick={() => (window.location.href = "/")}
					className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
				>
					Browse Products
				</button>
			</div>
		);
	}

	const total = cartItems.reduce(
		(sum, item) => sum + item.Product.price * item.quantity,
		0
	);

	return (
		<div className="px-20 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
			<div className="lg:col-span-2 space-y-6">
				{cartItems.map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between border border-indigo-100 rounded-2xl p-5 shadow-sm bg-gradient-to-br from-indigo-50 to-white transition-all"
					>
						<div className="flex items-center gap-6">
							<div className="w-24 h-24 flex items-center justify-center bg-white border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
								<img
									src={item.Product.image}
									alt={item.Product.name}
									className="max-h-full max-w-full object-contain transform transition duration-300 scale-90"
								/>
							</div>
							<div>
								<h2 className="font-semibold text-lg text-gray-800">
									{item.Product.name}
								</h2>
								<p className="text-indigo-600 font-bold mt-1 text-base">
									${item.Product.price}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-5">
							<div className="flex items-center bg-white border border-indigo-200 rounded-xl overflow-hidden shadow-sm">
								<button
									onClick={() =>
										updateQuantity(
											item.id,
											item.quantity - 1
										)
									}
									className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold cursor-pointer"
								>
									−
								</button>
								<span className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white">
									{item.quantity}
								</span>
								<button
									onClick={() =>
										updateQuantity(
											item.id,
											item.quantity + 1
										)
									}
									className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold cursor-pointer"
								>
									+
								</button>
							</div>

							<button
								onClick={() => removeItem(item.id)}
								className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition border border-red-200 shadow-sm cursor-pointer"
								title="Remove item"
							>
								<TrashIcon className="h-5 w-5" />
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl shadow-lg p-6 h-fit">
				<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
					Order Summary
				</h2>

				<div className="flex justify-between text-base mb-4">
					<span className="text-gray-600">Subtotal</span>
					<span className="font-medium text-gray-800">
						${total.toFixed(2)}
					</span>
				</div>

				<div className="flex justify-between text-base mb-4">
					<span className="text-gray-600">Shipping</span>
					<span className="font-medium text-green-600">Free</span>
				</div>

				<div className="border-t border-gray-200 my-4"></div>

				<div className="flex justify-between items-center mb-6">
					<span className="text-lg font-semibold text-gray-800">
						Total
					</span>
					<span className="text-2xl font-bold text-indigo-600">
						${total.toFixed(2)}
					</span>
				</div>

				<div className="space-y-3">
					<button
						onClick={placeOrder}
						className="w-full bg-indigo-600 text-white py-3 rounded-xl shadow-md hover:bg-indigo-700 transition cursor-pointer"
					>
						Place Order
					</button>
					<button
						onClick={clearCart}
						className="w-full border border-red-500 text-red-500 py-3 rounded-xl hover:bg-red-50 transition cursor-pointer"
					>
						Clear Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default Cart;
