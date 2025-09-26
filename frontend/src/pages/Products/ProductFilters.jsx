import React from "react";

const ProductFilters = ({
	search,
	setSearch,
	maxSlider,
	sortBy,
	sortOrder,
	setSortBy,
	setSortOrder,
	setPage,
}) => {
	return (
		<div className="flex flex-wrap items-center justify-end gap-5">
			<select
				id="sortBy"
				value={`${sortBy}-${sortOrder}`}
				onChange={(e) => {
					const [newSortBy, newSortOrder] = e.target.value.split("-");
					setSortBy(newSortBy);
					setSortOrder(newSortOrder);
					setPage(1);
				}}
				className="border rounded-lg py-2 px-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
			>
				<option value="createdAt-DESC">Date Added (Newest)</option>
				<option value="createdAt-ASC">Date Added (Oldest)</option>
				<option value="price-DESC">Price: High → Low</option>
				<option value="price-ASC">Price: Low → High</option>
				<option value="name-DESC">Name: Z → A</option>
				<option value="name-ASC">Name: A → Z</option>
			</select>

			<input
				type="text"
				placeholder="Search products..."
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setPage(1);
				}}
				className="border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-60 bg-white shadow-sm"
			/>
		</div>
	);
};

export default ProductFilters;
