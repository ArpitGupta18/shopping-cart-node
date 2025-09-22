import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

const getCart = async (req, res) => {
	try {
		let cart = await Cart.findOne({
			where: { userId: req.user.id },
			include: [{ model: CartItem, include: [Product] }],
		});

		if (!cart) {
			cart = await Cart.create({ userId: req.user.id });
		}

		res.json({ message: "Cart fetched successfully", cart });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;

		if (!productId || !quantity)
			return res
				.status(400)
				.json({ error: "Product ID and quantity are required" });

		const numQuantity = parseInt(quantity);
		if (isNaN(numQuantity) || numQuantity <= 0)
			return res
				.status(400)
				.json({ error: "Quantity must be a positive integer" });

		const product = await Product.findByPk(productId);
		if (!product)
			return res.status(404).json({ error: "Product not found" });

		let cart = await Cart.findOne({ where: { userId: req.user.id } });
		if (!cart) cart = await Cart.create({ userId: req.user.id });

		let cartItem = await CartItem.findOne({
			where: { cartId: cart.id, productId },
		});

		if (cartItem) {
			const newQuantity = cartItem.quantity + numQuantity;

			if (newQuantity > product.stock) {
				return res.status(400).json({
					error: `Only ${product.stock} units of ${product.name} available`,
				});
			}

			cartItem.quantity = newQuantity;
			await cartItem.save();
		} else {
			if (numQuantity > product.stock) {
				return res.status(400).json({
					error: `Only ${product.stock} units of ${product.name} available`,
				});
			}

			cartItem = await CartItem.create({
				cartId: cart.id,
				productId,
				quantity: numQuantity,
			});
		}

		const updatedCart = await Cart.findOne({
			where: { id: cart.id },
			include: [{ model: CartItem, include: [Product] }],
		});

		res.status(201).json({
			message: "Product added to cart",
			cartItem,
			cart: updatedCart,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateCartItem = async (req, res) => {
	try {
		const { itemId } = req.params;
		const { quantity } = req.body;

		const numQuantity = parseInt(quantity);
		if (isNaN(numQuantity))
			return res
				.status(400)
				.json({ error: "Quantity must be a valid number" });

		const cartItem = await CartItem.findByPk(itemId);

		if (!cartItem)
			return res.status(404).json({ error: "Cart item not found" });

		if (numQuantity <= 0) {
			await cartItem.destroy();
			return res.json({ message: "Cart item removed" });
		}

		const product = await Product.findByPk(cartItem.productId);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		if (numQuantity > product.stock) {
			return res.status(400).json({
				error: `Only ${product.stock} units of ${product.name} available`,
			});
		}

		cartItem.quantity = numQuantity;
		await cartItem.save();

		const updatedCart = await Cart.findByPk(cartItem.cartId, {
			include: [{ model: CartItem, include: [Product] }],
		});

		res.json({
			message: "Cart item updated",
			cartItem,
			cart: updatedCart,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const removeCartItem = async (req, res) => {
	try {
		const { itemId } = req.params;

		const cartItem = await CartItem.findByPk(itemId);
		if (!cartItem)
			return res.status(404).json({ error: "Cart item not found" });

		const cartId = cartItem.cartId;
		await cartItem.destroy();

		const updatedCart = await Cart.findOne({
			where: { id: cartId },
			include: [{ model: CartItem, include: [Product] }],
		});

		res.json({
			message: "Cart item removed successfully",
			cart: updatedCart,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const clearCart = async (req, res) => {
	try {
		const cart = await Cart.findOne({ where: { userId: req.user.id } });

		if (!cart) return res.status(404).json({ error: "Cart not found" });

		await CartItem.destroy({ where: { cartId: cart.id } });

		const updatedCart = await Cart.findByPk(cart.id, {
			include: [{ model: CartItem, include: [Product] }],
		});

		res.json({
			message: "Cart cleared successfully",
			cart: updatedCart,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default {
	getCart,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};
