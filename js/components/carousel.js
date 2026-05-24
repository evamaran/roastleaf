// Builds one carousel-specific product card
function createCarouselCard(product) {
	if (!product) {
		console.error("createCarouselCard: No product data received");
		return document.createElement("div");
	}

	const card = document.createElement("div");
	card.className = "carousel-item";

	const imageUrl = product.image?.url || "./images/placeholder.jpg";
	const imageAlt = product.image?.alt || product.title || "Product image";
	const title = product.title || "Missing title";
	const shortDescription = product.shortDescription || "";
	const priceValue = Number(product.price);
	const price = product.price ? `${priceValue.toFixed(2)} €` : "";

	card.innerHTML = `
		<a href="product.html?id=${product.id}" class="carousel-card">
			<img src="${imageUrl}" alt="${imageAlt}" class="carousel-image"/>

			<div class="carousel-info">
				<h3 class="carousel-title">${title}</h3>
				<p class="carousel-description">${shortDescription}</p>
				<p class="carousel-price">${price}</p>
				<button class="btn carousel-buy">Buy Now</button>
			</div>
		</a>
	`;

	return card;
}



// Builds and controls the carousel
export function renderCarousel(products) {

	// Find required DOM elements
	const track = document.querySelector("#carousel-track");
	const dotsContainer = document.querySelector("#carousel-dots");

	if (!track || !dotsContainer) {
		console.error("Carousel elements not found in the HTML");
		return;
	}

	// Select the first 3 products
	const featured = products.slice(0, 3);

	// Insert cards and dots
	featured.forEach((product, index) => {
		const card = createCarouselCard(product);
		track.appendChild(card);

		const dot = document.createElement("button");
		if (index === 0) dot.classList.add("active");
		dotsContainer.appendChild(dot);
	});

	let currentIndex = 0;

	// Query items and dots after insertion
	const items = document.querySelectorAll(".carousel-item");
	const dots = document.querySelectorAll("#carousel-dots button");

	// Moves the carousel to the selected slide
	function updateCarousel(index) {
		track.style.transform = `translateX(-${index * 100}%)`;
		dots.forEach(d => d.classList.remove("active"));
		dots[index].classList.add("active");
	}

	// Right arrow
	document.querySelector(".carousel-btn.right").addEventListener("click", () => {
		currentIndex = (currentIndex + 1) % items.length;
		updateCarousel(currentIndex);
	});

	// Left arrow
	document.querySelector(".carousel-btn.left").addEventListener("click", () => {
		currentIndex = (currentIndex - 1 + items.length) % items.length;
		updateCarousel(currentIndex);
	});

	// Dot navigation
	dots.forEach((dot, i) => {
		dot.addEventListener("click", () => {
			currentIndex = i;
			updateCarousel(currentIndex);
		});
	});
}
