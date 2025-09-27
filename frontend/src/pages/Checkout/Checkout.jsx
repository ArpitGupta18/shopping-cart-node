import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const Checkout = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const { cartItems } = location.state || { cartItems: [] };

	const cartTotal = cartItems.reduce(
		(sum, item) => sum + item.Product.price * item.quantity,
		0
	);

	console.log("cartItems at checkout:", cartItems);

	return (
		<div className="h-[805px] py-12 px-6">
			<div className="max-w-4xl mx-auto bg-white p-8">
				<h2 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-4">
					Order Summary
				</h2>

				<>
					<ul className="divide-y divide-gray-200">
						{cartItems.map((item) => (
							<li
								key={item.id}
								className="flex items-center justify-between py-6"
							>
								<div className="flex items-center gap-4">
									<img
										src={item.Product.image}
										alt={item.Product.name}
										className="w-24 h-24 object-cover rounded-lg shadow-md"
									/>
									<div>
										<p className="font-semibold text-lg text-gray-800">
											{item.Product.name}
										</p>
										<p className="text-gray-500">
											Quantity: {item.quantity}
										</p>
									</div>
								</div>
								<p className="text-xl font-semibold text-indigo-600">
									$
									{(
										item.Product.price * item.quantity
									).toFixed(2)}
								</p>
							</li>
						))}
					</ul>

					<div className="flex justify-between items-center mt-8 text-2xl font-bold border-t pt-8">
						<span>Total:</span>
						<span className="text-indigo-700">
							${cartTotal.toFixed(2)}
						</span>
					</div>
				</>

				<div className="mt-10 flex justify-center">
					<button
						onClick={() => navigate("/")}
						className="px-8 py-3 rounded-xl bg-indigo-600 text-white text-lg font-medium shadow-md hover:bg-indigo-700 transition cursor-pointer"
					>
						← Browse Products
					</button>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
