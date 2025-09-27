import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";

const placeOrder = async (req, res) => {
	try {
		const userId = req.user.id;

		const cart = await Cart.findOne({
			where: { userId },
			include: [{ model: CartItem, include: [Product] }],
		});

		if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
			return res.status(400).json({ error: "Cart is empty" });
		}

		let totalPrice = 0;
		const orderItems = [];

		for (const item of cart.CartItems) {
			console.log(item);
			const product = item.Product;

			if (product.stock < item.quantity) {
				return res.status(400).json({
					error: `Insufficient stock for product ${product.name}`,
				});
			}

			const itemPrice = product.price * item.quantity;
			totalPrice += itemPrice;

			orderItems.push({
				productId: product.id,
				quantity: item.quantity,
				price: itemPrice,
			});

			product.stock -= item.quantity;
			await product.save();
		}

		const order = await Order.create(
			{
				userId,
				totalPrice,
				paymentStatus: "pending",
				deliveryStatus: "pending",
				OrderItems: orderItems,
			},
			{ include: [OrderItem] }
		);

		await cart.destroy();

		res.status(201).json({ message: "Order placed successfully", order });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.findAll({
			where: { userId: req.user.id },
			include: [{ model: OrderItem, include: [Product] }],
		});
		res.json({ message: "Orders fetched successfully", orders });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.findAll({
			include: [{ model: OrderItem, include: [Product] }],
		});

		res.json({ message: "All orders fetched successfully", orders });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default { placeOrder, getMyOrders, getAllOrders };
