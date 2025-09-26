import React from "react";
import cartService from "../../services/cartService";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { toast } from "react-toastify";

const ProductGrid = ({ products, cartItems, setCartItems }) => {
	const { user } = useAuth();
	const { refreshCart } = useCart();

	const addToCart = async (product) => {
		if (!user) {
			toast.info("Please log in to add items to your cart.");
			return;
		}
		try {
			const res = await cartService.addToCart(product.id, 1);
			setCartItems((prev) => [
				...prev,
				{
					id: res.cartItem?.id || Date.now(),
					productId: product.id,
					quantity: 1,
					Product: product,
				},
			]);

			toast.success(`${product.name} added to cart!`);
			await refreshCart();
		} catch (error) {
			toast.error("Failed to add to cart.");
		}
	};

	const isInCart = (productId) =>
		cartItems.some((item) => item.productId === productId);

	if (products.length === 0)
		return (
			<div className="flex flex-col items-center justify-center py-60 px-6 bg-white rounded-xl  border border-gray-200">
				<div className="text-6xl mb-4">🛍️</div>

				<h2 className="text-xl font-semibold text-gray-800 mb-2">
					No products found
				</h2>
				<p className="text-gray-500 text-center max-w-md">
					We couldn’t find any products matching your search or
					filters. Try adjusting your filters or browse all products.
				</p>
			</div>
		);

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{products.map((product) => (
					<div
						key={product.id}
						className="border rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col"
					>
						<div className="h-36 w-full flex items-center justify-center p-2">
							<img
								src={product.image}
								alt={product.name}
								className="max-h-full max-w-full object-contain"
							/>
						</div>

						<div className="p-3 flex flex-col flex-grow">
							<h2 className="font-semibold text-base mb-1 line-clamp-1">
								{product.name}
							</h2>

							<p
								className={`text-sm font-medium ${
									product.stock > 0
										? "text-green-600"
										: "text-red-500"
								}`}
							>
								{product.stock > 0
									? `${product.stock} in stock`
									: "Out of stock"}
							</p>

							<p className="mt-2 font-bold text-indigo-600">
								${product.price}
							</p>

							{isInCart(product.id) ? (
								<button
									disabled
									className="mt-3 py-1.5 px-3 rounded-md text-sm bg-gray-300 text-gray-500 cursor-not-allowed"
								>
									In Cart
								</button>
							) : (
								<button
									disabled={product.stock <= 0}
									onClick={() => addToCart(product)}
									className={`mt-3 py-1.5 px-3 rounded-md text-sm transition ${
										product.stock > 0
											? "bg-indigo-600 cursor-pointer text-white hover:bg-indigo-700"
											: "bg-gray-300 text-gray-500 cursor-not-allowed"
									}`}
								>
									Add to Cart
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductGrid;
