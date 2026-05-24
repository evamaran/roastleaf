// Imports the function that creates one product card
import { createProductCard } from "../components/productCard.js";

// This function shows products on the landing page
export function renderProducts(products) {

	// Finds the container where the product cards will be placed
	const container = document.querySelector("#product-list");

	// Shows a loading message while products are being prepared
	container.innerHTML = "<p>Loading products...</p>";

	try {
		// Uses the products passed in, or the global products from main.js
		const data = products || window.products;

		// If no products were found, show a simple message
		if (!data || data.length === 0) {
			container.innerHTML = "<p>No products found.</p>";
			return;
		}

		// Clears the loading message before adding real content
		container.innerHTML = "";

		// Bestsellers logic

		// Pick 2 whole bean coffees 
		const beans = data
			.filter(p => p.category === "coffee" && !p.tags.includes("ground"))
			.slice(0, 2);

		// Pick 1 ground coffee
		const ground = data
			.filter(p => p.tags.includes("ground"))
			.slice(0, 1);

		// Pick 1 tea
		const tea = data
			.filter(p => p.category === "tea")
			.slice(0, 1);

		// Combine them into one list
		const bestsellers = [...beans, ...ground, ...tea];

		// --- RENDER BESTSELLERS ON THE PAGE ---

		// Create a card for each product in the bestseller list
		bestsellers.forEach(product => {
			const card = createProductCard(product);
			container.appendChild(card);
		});

	} catch (error) {
		// If something unexpected happens, show a simple error message
		container.innerHTML = "<p>Something went wrong. Please try again.</p>";
		console.error("Error rendering products:", error);
	}
}