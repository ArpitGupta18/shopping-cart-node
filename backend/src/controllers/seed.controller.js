import Product from "../models/Product.js";
import { productSeed } from "../data/productSeed.js";

const seedProducts = async (req, res) => {
	try {
		await Product.bulkCreate(productSeed, { ignoreDuplicates: true });
		res.status(201).json({ message: "Products seeded successfully" });
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};

export default { seedProducts };
