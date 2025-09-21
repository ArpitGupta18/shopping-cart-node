import sequelize from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { Op } from "sequelize";

const getProducts = async (req, res) => {
	try {
		let { page = 1, limit = 6, search = "" } = req.query;
		page = parseInt(page);
		limit = parseInt(limit);

		const offset = (page - 1) * limit;

		const whereClause = search
			? {
					[Op.or]: [
						{
							name: {
								[Op.iLike]: `%${search}%`,
							},
						},
					],
			  }
			: {};

		// const products = await Product.findAll();
		const { rows: products, count } = await Product.findAndCountAll({
			where: whereClause,
			limit,
			offset,
			order: [["createdAt", "DESC"]],
			include: [
				{
					model: Category,
					attributes: ["id", "name"],
				},
			],
		});

		if (products.length === 0) {
			return res.status(404).json({ message: "No products found" });
		}
		res.json({
			message: "Products fetched successfully",
			products,
			pagination: {
				total: count,
				page,
				limit,
				totalPages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createProduct = async (req, res) => {
	try {
		const { name, description, price, stock, categoryId } = req.body;

		const numPrice = parseFloat(price);
		const numStock = parseInt(stock);

		const image = req.file
			? `/uploads/${req.file.filename}`
			: "/uploads/default.png";

		if (!name || isNaN(numPrice) || isNaN(numStock)) {
			return res.status(400).json({
				error: "Name, price and stock fields are required",
			});
		}

		if (numPrice < 0) {
			return res.status(400).json({ error: "Price cannot be negative" });
		}

		if (numStock < 0) {
			return res.status(400).json({ error: "Stock cannot be negative" });
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

		let categoryIdValue = null;
		if (categoryId && categoryId.trim() !== "") {
			const category = await Category.findByPk(categoryId);
			if (!category) {
				return res.status(400).json({ error: "Invalid categoryId" });
			}
			categoryIdValue = categoryId;
		}

		const product = await Product.create({
			name,
			description,
			price: numPrice,
			stock: numStock,
			image,
			categoryId: categoryIdValue,
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
		const product = await Product.findByPk(id, {
			include: [
				{
					model: Category,
					attributes: ["id", "name"],
				},
			],
		});

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
		const { name, description, price, stock, categoryId } = req.body;

		const numPrice = parseFloat(price);
		const numStock = parseInt(stock);

		if (!name || isNaN(numPrice) || isNaN(numStock)) {
			return res.status(400).json({
				error: "Name, price and stock fields are required",
			});
		}

		if (numPrice < 0) {
			return res.status(400).json({ error: "Price cannot be negative" });
		}

		if (numStock < 0) {
			return res.status(400).json({ error: "Stock cannot be negative" });
		}

		const product = await Product.findByPk(id);
		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		let categoryIdValue = product.categoryId;
		if (categoryId !== undefined) {
			if (categoryId.trim() === "") {
				categoryIdValue = null;
			} else {
				const category = await Category.findByPk(categoryId);
				if (!category) {
					return res
						.status(400)
						.json({ error: "Invalid categoryId" });
				}
				categoryIdValue = categoryId;
			}
		}

		const image = req.file
			? `/uploads/${req.file.filename}`
			: product.image;

		await product.update({
			name,
			description,
			price: numPrice,
			stock: numStock,
			image,
			categoryId: categoryIdValue,
		});

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
