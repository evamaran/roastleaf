import { updateCartCount } from "../utils/cartUtils.js";
import { showToast } from "../utils/main.js";

// get id from url
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// load products
fetch("/roast-leaf/data/products.json")
	.then(res => {
		if (!res.ok) throw new Error("Failed to load products file");
		return res.json();
	})
	.then(products => {
		// find product
		const product = products.find(p => p.id === productId);

		// if no product found
		if (!product) {
			document.querySelector(".product-detail").innerHTML =
				`<p>Sorry, this product does not exist. Go back to <a href="categories.html">Categories</a>.</p>`;
			return;
		}

		// fill basic info
		document.getElementById("product-title").textContent = product.title || "No title";
		document.getElementById("product-image").src = product.image?.url || "";
		document.getElementById("product-image").alt = product.image?.alt || "Product image";
		document.getElementById("product-short").textContent = product.shortDescription || "No description";
		document.getElementById("product-long").textContent = product.longDescription || "";
		document.getElementById("product-price").textContent =
			product.price ? `€ ${product.price.toFixed(2)}` : "Price unavailable";
		document.getElementById("breadcrumb-product").textContent = product.title || "Product";

		// specs list
		const specsList = document.querySelector(".product-specs");
		specsList.innerHTML = ""; // clear first

		// if coffee, show all specs
		if (product.category === "coffee") {
			specsList.innerHTML = `
        <li><strong>Weight:</strong> ${product.weight || "N/A"}</li>
        <li><strong>Origin:</strong> ${product.origin || "N/A"}</li>
        <li><strong>Roast level:</strong> ${product.roastLevel || "N/A"}</li>
        <li><strong>Brew methods:</strong> ${product.brewMethods?.join(", ") || "N/A"}</li>
      `;
		}

		// if tea,only weight and origin
		if (product.category === "tea") {
			specsList.innerHTML = `
        <li><strong>Weight:</strong> ${product.weight || "N/A"}</li>
        <li><strong>Origin:</strong> ${product.origin || "N/A"}</li>
      `;
		}

		// if gear, hide specs
		if (product.category === "gear") {
			specsList.style.display = "none";
		}

		// related products
		const related = products
			.filter(p => p.category === product.category && p.id !== product.id)
			.slice(0, 4);

		const relatedGrid = document.getElementById("related-grid");

		// if no related products
		if (related.length === 0) {
			relatedGrid.innerHTML = `<p>No related products found.</p>`;
		} else {
			relatedGrid.innerHTML = related
				.map(p => `
          <a href="product.html?id=${p.id}" class="related-card">
            <img src="${p.image?.url || ""}" alt="${p.image?.alt || "Product"}" class="related-image">
            <h3 class="related-title">${p.title || "No title"}</h3>
            <p class="related-price">€ ${p.price?.toFixed(2) || "N/A"}</p>
          </a>
        `)
				.join("");
		}

		// add to cart
		document.getElementById("add-to-cart").addEventListener("click", () => {
			// get cart
			let cart = JSON.parse(localStorage.getItem("cart")) || [];

			// find item
			const existing = cart.find(i => i.id === product.id);

			// update qty
			if (existing) {
				existing.quantity++;
			} else {
				cart.push({ id: product.id, quantity: 1 });
			}

			// save
			localStorage.setItem("cart", JSON.stringify(cart));

			// update header badge
			updateCartCount();

			// show toast
			showToast(`${product.title} added to cart!`, 3000, "success");

		});
	})
	.catch(err => {
		console.error("Error loading products:", err);

		// show error
		document.querySelector(".product-detail").innerHTML =
			`<p>Something went wrong while loading this product. Please try again later.</p>`;
	});