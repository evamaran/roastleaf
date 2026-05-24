import { getProducts } from "../api/products.js";

async function init() {
	// Load products globally
	let products = window.products;
	if (!products || products.length === 0) {
		products = await getProducts();
		window.products = products;
	}

	// Get category from HTML
	const section = document.querySelector(".product-section");
	const category = section?.dataset?.category;

	if (!category) return;

	// Filter products by category
	const categoryProducts = products.filter(
		p => p.category.toLowerCase() === category.toLowerCase()
	);

	// Render all products initially
	renderProducts(categoryProducts);

	// Setup filter buttons
	setupFilters(categoryProducts);
}

function setupFilters(products) {
	const buttons = document.querySelectorAll(".filter-btn");

	buttons.forEach(btn => {
		btn.addEventListener("click", () => {
			// Toggle active state
			btn.classList.toggle("active");

			// Collect all active filters
			const activeFilters = [...buttons]
				.filter(b => b.classList.contains("active"))
				.map(b => b.dataset.type.toLowerCase());

			// If no filters → show all
			if (activeFilters.length === 0) {
				renderProducts(products);
				return;
			}

			// Filter products by tags
			const filtered = products.filter(p =>
				p.tags.some(tag => activeFilters.includes(tag.toLowerCase()))
			);

			renderProducts(filtered);
		});
	});
}

function renderProducts(products) {
	const container = document.querySelector(".product-grid");
	if (!container) return;

	container.innerHTML = "";

	products.forEach(product => {
		const card = document.createElement("a");
		card.href = `product.html?id=${product.id}`;
		card.className = "product-card";

		card.innerHTML = `
			<img src="${product.image?.url}" alt="${product.image?.alt || product.title}" class="product-image">
			<div class="product-info">
				<h3 class="product-title">${product.title}</h3>
				<p class="product-price">€${Number(product.price).toFixed(2)}</p>
			</div>
		`;

		container.appendChild(card);
	});
}

init();