import { loadLayout } from "../layout/loadLayout.js";
import { getProducts } from "../api/products.js";
import { initSearch } from "../components/search.js";

// Works locally AND on GitHub Pages
function isHomePage() {
	const path = window.location.pathname;

	return (
		path.endsWith("index.html") ||
		path === "/roast-leaf/" ||
		path === "/roast-leaf/index.html" ||
		path === "/" ||
		path === "/index.html"
	);
}


async function init() {
	// Load layout first
	await loadLayout();

	// Load products and store globally
	let products = window.products;
	if (!products || products.length === 0) {
		products = await getProducts();
		window.products = products;
	}

	// Initialize search after layout + products exist
	initSearch();

	// Connect search icon
	const searchToggle = document.getElementById("searchToggle");
	if (searchToggle && window.openSearch) {
		searchToggle.addEventListener("click", window.openSearch);
	}

	// Landing page logic
	if (isHomePage()) {
		const { renderProducts } = await import("../pages/index.js");
		const { renderCarousel } = await import("../components/carousel.js");

		renderProducts(products);
		renderCarousel(products);

		const buttons = document.querySelectorAll(".filter-btn");
		buttons.forEach(btn => {
			btn.addEventListener("click", () => {
				buttons.forEach(b => b.classList.remove("active"));
				btn.classList.add("active");

				const type = btn.textContent.trim().toLowerCase();
				const filtered = products.filter(p =>
					p.tags.some(tag => tag.toLowerCase().includes(type))
				);

				renderProducts(filtered);
			});
		});
	}
}

init();

// Toast function for showing messages to the user
export function showToast(message, duration = 3000, type = "success") {
	const toast = document.getElementById("toast");
	if (!toast) return;

	// Check if user is near the top of the page
	const atTop = window.scrollY < 120; // adjust if your header is taller

	// Position toast based on scroll position
	if (atTop) {
		toast.style.top = "5rem";
		toast.style.bottom = "auto";
	} else {
		toast.style.top = "auto";
		toast.style.bottom = "2rem";
	}

	// Show toast
	toast.textContent = message;
	toast.className = `toast ${type} show`;

	// Hide after duration
	setTimeout(() => {
		toast.classList.remove("show");
	}, duration);
}
