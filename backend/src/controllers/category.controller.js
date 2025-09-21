import Category from "../models/Category.js";

const getCategories = async (req, res) => {
	try {
		const categories = await Category.findAll();

		if (!categories || categories.length === 0) {
			return res.status(404).json({ message: "No categories found" });
		}

		res.json({ message: "Categories fetched successfully", categories });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getCategoryById = async (req, res) => {
	try {
		const { id } = req.params;
		const category = await Category.findByPk(id);

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.json({ message: "Category found", category });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const createCategory = async (req, res) => {
	try {
		const { name } = req.body;

		if (!name || name.trim() === "")
			return res.status(400).json({ error: "Category name is required" });

		const existingCategory = await Category.findOne({
			where: { name: name.trim() },
		});

		if (existingCategory)
			return res.status(400).json({ error: "Category already exists" });

		const category = await Category.create({ name: name.trim() });

		res.status(201).json({
			message: "Category created successfully",
			category,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		if (!name || name.trim() === "")
			return res.status(400).json({ error: "Category name is required" });

		const category = await Category.findByPk(id);

		if (!category)
			return res.status(404).json({ error: "Category not found" });

		await category.update({ name: name.trim() });

		res.json({ message: "Category updated successfully", category });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;

		const category = await Category.findByPk(id);

		if (!category)
			return res.status(404).json({ error: "Category not found" });

		await category.destroy();

		res.json({ message: "Category deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export default {
	getCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
};
