import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const Pagination = ({ page, setPage, pagination }) => {
	if (!pagination || pagination.totalPages <= 1) return null;

	const { totalPages } = pagination;

	const getPageNumbers = () => {
		let start = Math.max(page - 1, 1);
		let end = Math.min(start + 2, totalPages);

		if (end - start < 2) {
			start = Math.max(end - 2, 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	return (
		<div className="flex justify-end mt-6">
			<div className="flex items-center gap-2">
				<button
					onClick={() => setPage((p) => Math.max(p - 1, 1))}
					disabled={page === 1}
					className={`p-2 border rounded ${
						page === 1
							? "bg-gray-200 text-gray-400 cursor-not-allowed"
							: "hover:bg-gray-100"
					}`}
				>
					<ChevronLeftIcon className="h-4 w-4" />
				</button>

				{getPageNumbers().map((pNum) => (
					<button
						key={pNum}
						onClick={() => setPage(pNum)}
						className={`px-3 py-1 border rounded ${
							page === pNum
								? "bg-indigo-600 text-white border-indigo-600"
								: "hover:bg-gray-100"
						}`}
					>
						{pNum}
					</button>
				))}

				<button
					onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
					disabled={page === totalPages}
					className={`p-2 border rounded ${
						page === totalPages
							? "bg-gray-200 text-gray-400 cursor-not-allowed"
							: "hover:bg-gray-100"
					}`}
				>
					<ChevronRightIcon className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
