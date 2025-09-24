import React, { useState, useEffect } from "react";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import ProductGrid from "./ProductGrid";
import ProductFilters from "./ProductFilters";
import CategoryFilter from "./CategoryFilter";
import Pagination from "../../components/common/Pagination";
import { Range } from "react-range";
import { useAuth } from "../../hooks/useAuth";
import cartService from "../../services/cartService";

const Products = () => {
	const { user } = useAuth();

	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [pagination, setPagination] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [search, setSearch] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [maxSlider, setMaxSlider] = useState(1000);
	const [priceRange, setPriceRange] = useState([0, 1000]);
	const [sortBy, setSortBy] = useState("createdAt");
	const [sortOrder, setSortOrder] = useState("DESC");
	const [page, setPage] = useState(1);

	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		const fetchCartItems = async () => {
			if (!user) return;
			try {
				const data = await cartService.getCart();
				setCartItems(data.cart?.CartItems || []);
			} catch (error) {
				console.error("Failed to fetch cart items:", error);
			}
		};
		fetchCartItems();
	}, [user]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const data = await categoryService.getCategories();
				setCategories(data.categories);
			} catch (error) {
				setError("Failed to fetch categories");
			}
		};
		fetchCategories();
	}, []);

	const toggleCategory = (id) => {
		setSelectedCategories((prev) =>
			prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
		);
		setPage(1);
	};

	const fetchProducts = async () => {
		try {
			const data = await productService.getProducts({
				page,
				limit: 10,
				search,
				categories: selectedCategories.join(","),
				maxPrice: priceRange[1],
				minPrice: priceRange[0],
				sortBy,
				sortOrder,
			});
			setProducts(data.products);
			setPagination(data.pagination);

			if (data.maxPrice) {
				setMaxSlider(Math.ceil(data.maxPrice / 100) * 100);

				if (priceRange[1] === 1000) {
					setPriceRange([0, Math.ceil(data.maxPrice / 100) * 100]);
				}
			}
		} catch (error) {
			setError("Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			fetchProducts();
		}, 100);

		return () => clearTimeout(timeout);
	}, [page, search, selectedCategories, priceRange, sortBy, sortOrder]);

	const getPageNumbers = () => {
		if (!pagination) return [];

		let start = Math.max(page - 1, 1);
		let end = Math.min(start + 2, pagination.totalPages);

		if (end - start < 2) {
			start = Math.max(end - 2, 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;

	console.log(products);
	console.log("cartItems:", cartItems);
	return (
		<div className="my-10 px-20">
			<div className="flex gap-12">
				<div className="w-64 pr-6 h-[730px] border-r space-y-8">
					<CategoryFilter
						categories={categories}
						selectedCategories={selectedCategories}
						toggleCategory={toggleCategory}
					/>

					<div className="space-y-3 border-b pb-8">
						<label
							htmlFor="priceRange"
							className="block text-md font-semibold text-gray-700"
						>
							Price Range
						</label>

						<p className="text-sm text-gray-600">
							${priceRange[0]} – ${priceRange[1]}
						</p>
						<Range
							step={10}
							min={0}
							max={maxSlider}
							values={priceRange}
							onChange={(values) => {
								if (values[0] >= values[1]) return;
								setPriceRange(values);
								setPage(1);
							}}
							renderTrack={({ props, children }) => (
								<div
									{...props}
									className="h-2 bg-gray-200 rounded relative cursor-pointer w-54 ms-2"
								>
									<div
										className="absolute h-2 bg-indigo-500 rounded"
										style={{
											left: `${
												(priceRange[0] / maxSlider) *
												100
											}%`,
											width: `${
												((priceRange[1] -
													priceRange[0]) /
													maxSlider) *
												100
											}%`,
										}}
									/>
									{children}
								</div>
							)}
							renderThumb={({ props }) => {
								const { key, ...rest } = props;
								return (
									<div
										key={key}
										{...rest}
										className="h-5 w-5 bg-indigo-600 rounded-full shadow-md cursor-pointer"
									/>
								);
							}}
						/>
					</div>
					<button
						onClick={() => {
							setSearch("");
							setSelectedCategories([]);
							setPriceRange([0, maxSlider]);
							setSortBy("createdAt");
							setSortOrder("DESC");
							setPage(1);
						}}
						className="w-full text-md text-white bg-red-400 hover:bg-red-500 py-2 px-4 rounded-lg transition cursor-pointer"
					>
						Reset Filters
					</button>
				</div>
				<div className="flex-1 ">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-7 gap-4">
						<div>
							{products.length > 0 && pagination && (
								<p className="text-md mt-2 text-gray-600">
									Showing {(page - 1) * pagination.limit + 1}–
									{Math.min(
										page * pagination.limit,
										pagination.total
									)}{" "}
									of {pagination.total} products
								</p>
							)}
						</div>

						<ProductFilters
							search={search}
							setSearch={setSearch}
							maxSlider={maxSlider}
							sortBy={sortBy}
							setSortBy={setSortBy}
							sortOrder={sortOrder}
							setSortOrder={setSortOrder}
							setPage={setPage}
						/>
					</div>

					<ProductGrid
						products={products}
						cartItems={cartItems}
						setCartItems={setCartItems}
					/>

					<Pagination
						page={page}
						setPage={setPage}
						pagination={pagination}
					/>
				</div>
			</div>
		</div>
	);
};

export default Products;
