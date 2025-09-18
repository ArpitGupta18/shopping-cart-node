import sequelize from "../config/db.js";
import Product from "../models/Product.js";

const getProducts = async (req, res) => {
	try {
		const products = await Product.findAll();

		if (products.length === 0) {
			return res.status(404).json({ message: "No products found" });
		}
		res.json({ message: "Products fetched successfully", products });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createProduct = async (req, res) => {
	try {
		const { name, description, price, stock } = req.body;

		if (!name || !description || !price || !stock) {
			return res.status(400).json({ error: "All fields are required" });
		}

		const existingProduct = await Product.findOne({
			where: sequelize.where(
				sequelize.fn("LOWER", sequelize.col("name")),
				name.toLowerCase()
			),
		});

		if (existingProduct) {
			return res.status(400).json({ error: "Product already exists" });
		}

		const product = await Product.create({
			name,
			description,
			price,
			stock,
		});
		res.status(201).json({
			message: "Product added successfully",
			product,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByPk(id);

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		res.json({ message: "Product found", product });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, price, stock } = req.body;

		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		await product.update({ name, description, price, stock });
		res.json({ message: "Product updated successfully", product });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;

		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		await product.destroy();
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default {
	getProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
};
