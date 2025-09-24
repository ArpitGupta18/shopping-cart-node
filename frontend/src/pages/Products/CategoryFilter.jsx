import React from "react";

const CategoryFilter = ({ categories, selectedCategories, toggleCategory }) => {
	return (
		<div className="pb-4 border-b">
			<h3 className="text-lg font-semibold mb-4 border-b pb-2">
				Categories
			</h3>

			<div className="space-y-3">
				{categories.map((cat) => (
					<label
						key={cat.id}
						className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-indigo-600"
					>
						<input
							type="checkbox"
							checked={selectedCategories.includes(cat.id)}
							onChange={() => toggleCategory(cat.id)}
							className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
						/>
						<span className="text-sm">{cat.name}</span>
					</label>
				))}

				<label className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-indigo-600">
					<input
						type="checkbox"
						checked={selectedCategories.includes("none")}
						onChange={() => toggleCategory("none")}
						className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
					/>
					<span className="text-sm">No Category</span>
				</label>
			</div>
		</div>
	);
};

export default CategoryFilter;
