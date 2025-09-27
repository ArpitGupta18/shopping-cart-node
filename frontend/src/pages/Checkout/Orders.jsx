import React from "react";
import { useOrder } from "../../hooks/useOrder";

const Orders = () => {
	const { orders } = useOrder();

	console.log(orders);
	return (
		<div className="min-h-screen bg-gray-50 py-10 px-6">
			<div className="max-w-5xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-gray-800">
					My Orders
				</h1>

				{!orders || orders.length === 0 ? (
					<p className="text-gray-600 text-lg">
						You have no orders yet.
					</p>
				) : (
					<div className="space-y-6">
						{orders.map((order) => (
							<div
								key={order.id}
								className="bg-white shadow-lg rounded-xl p-6 border border-gray-200"
							>
								<div className="flex justify-between items-center mb-4">
									<div>
										<p className="text-sm text-gray-500">
											Order ID:{" "}
											<span className="font-mono text-gray-700">
												{order.id.slice(0, 8)}...
											</span>
										</p>
										<p className="text-sm text-gray-500">
											Placed on:{" "}
											{new Date(
												order.createdAt
											).toLocaleString()}
										</p>
									</div>
									<div className="text-xl font-bold text-indigo-600">
										${order.totalPrice.toFixed(2)}
									</div>
								</div>

								{/* Statuses */}
								<div className="flex gap-4 mb-4">
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											order.paymentStatus === "paid"
												? "bg-green-100 text-green-700"
												: "bg-yellow-100 text-yellow-700"
										}`}
									>
										Payment: {order.paymentStatus}
									</span>
									<span
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											order.deliveryStatus === "delivered"
												? "bg-green-100 text-green-700"
												: "bg-gray-100 text-gray-700"
										}`}
									>
										Delivery: {order.deliveryStatus}
									</span>
								</div>

								{/* Items */}
								<div>
									<h3 className="text-lg font-semibold mb-2 text-gray-800">
										Items
									</h3>
									<ul className="space-y-3">
										{order.OrderItems?.map((item) => (
											<li
												key={item.id}
												className="flex justify-between items-center border-b pb-2"
											>
												<div>
													<p className="font-medium text-gray-700">
														{item.Product.name}
													</p>
													<p className="text-sm text-gray-500">
														Qty: {item.quantity}
													</p>
												</div>
												<p className="font-semibold text-gray-800">
													${item.price.toFixed(2)}
												</p>
											</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Orders;
