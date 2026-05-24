// Creates one product card based on the product data I send in
export function createProductCard(product) {

	// Check if I actually got a product
	if (!product) {
		console.error("createProductCard: No product data received");
		return document.createElement("div"); // return an empty element to prevent crash
	}

	// Create the outer card container
	const card = document.createElement("a");
	card.className = "product-card";
	card.href = `/product.html?id=${product.id}`;

	// Fallback values if something is missing in the product data
	const imageUrl = product.image?.url || "./images/placeholder.jpg";
	const imageAlt = product.image?.alt || product.title || "Product image";
	const title = product.title || "Missing title";
	const priceValue = Number(product.price);
	const price = product.price
		? `${priceValue.toFixed(2)} €`
		: "No price available";


	// Add HTML structure for the card
	card.innerHTML = `
	<img src="${imageUrl}" alt="${imageAlt}" class="product-image"/>

	<div class="product-info">
	<h3 class="product-title">${title}</h3>
	<p class="product-price">${price}</p>
	</div>
	`;

	// Return finished card so index.js can place it in the grid
	return card;
}