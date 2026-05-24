import { updateCartCount } from "../utils/cartUtils.js";

// store loaded products globally so we can re-render without page reload
let productsData = [];

// Load header + footer before anything else

// get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// load products
fetch("../data/products.json")
	.then(res => {
		if (!res.ok) throw new Error("Failed to load products file");
		return res.json();
	})
	.then(products => {
		// store products globally so we can re-render without reload
		productsData = products;

		// render cart items
		renderCart(productsData);

		// render gear section
		renderGear(productsData);
	})
	.catch(err => {
		console.error("Error loading products:", err);

		// show user-friendly error
		document.querySelector(".cart-container").innerHTML =
			`<p>Something went wrong while loading your cart. Please try again later.</p>`;
	});


// render cart items
function renderCart(products) {
	const cartItemsEl = document.getElementById("cart-items");

	// if cart is empty
	if (cart.length === 0) {
		cartItemsEl.innerHTML = `<p>Your cart is empty.</p>`;
		updateTotal();
		return;
	}

	// build cart UI
	cartItemsEl.innerHTML = cart
		.map(item => {
			const product = products.find(p => p.id === item.id);

			// if product missing
			if (!product) {
				return `<p>One item could not be loaded.</p>`;
			}

			return `
				<div class="cart-item">
					<a href="product.html?id=${product.id}">
						<img src="${product.image?.url || ""}" alt="${product.image?.alt || "Product"}" class="cart-item-image">
					</a>

					<div class="cart-item-info">
						<a href="product.html?id=${product.id}" class="cart-item-title">
							${product.title || "No title"}
						</a>
						<p class="cart-item-price">€ ${product.price?.toFixed(2) || "N/A"}</p>

						<div class="cart-qty">
							<button class="qty-btn" data-id="${item.id}" data-action="minus">-</button>
							<span class="qty-number">${item.quantity}</span>
							<button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
						</div>
					</div>

					<button class="remove-btn" data-id="${item.id}">
						<i class="fa-solid fa-xmark"></i>
					</button>
				</div>
	`;
		})
		.join("");

	// add listeners
	document.querySelectorAll(".qty-btn").forEach(btn => {
		btn.addEventListener("click", handleQtyChange);
	});

	document.querySelectorAll(".remove-btn").forEach(btn => {
		btn.addEventListener("click", removeItem);
	});

	updateTotal(products);
}


// Handle + / - quantity buttons without reloading the page
function handleQtyChange(e) {
	const id = e.target.dataset.id;
	const action = e.target.dataset.action;

	// Find the item in the cart
	const item = cart.find(i => i.id === id);
	if (!item) return;

	// Update quantity based on action
	if (action === "plus") item.quantity++;
	if (action === "minus") item.quantity--;

	// Remove item if quantity reaches zero
	if (item.quantity <= 0) {
		cart = cart.filter(i => i.id !== id);
	}

	// Save updated cart to localStorage
	localStorage.setItem("cart", JSON.stringify(cart));

	// Re-render cart UI without refreshing the entire page
	renderCart(productsData);
}

// remove item
function removeItem(e) {
	const id = e.target.closest("button").dataset.id;
	cart = cart.filter(i => i.id !== id);
	localStorage.setItem("cart", JSON.stringify(cart));
	location.reload();
}

// update total price
function updateTotal(products) {
	const totalEl = document.getElementById("cart-total");

	if (!cart.length) {
		totalEl.textContent = "€ 0.00";
		return;
	}

	let total = 0;

	cart.forEach(item => {
		const product = products.find(p => p.id === item.id);
		if (product) {
			total += product.price * item.quantity;
		}
	});

	totalEl.textContent = `€ ${total.toFixed(2)}`;
}

// render gear section
function renderGear(products) {
	const gearGrid = document.getElementById("gear-grid");

	const gear = products.filter(p => p.category === "gear").slice(0, 4);

	if (gear.length === 0) {
		gearGrid.innerHTML = `<p>No gear available.</p>`;
		return;
	}

	gearGrid.innerHTML = gear
		.map(g => `
			<a href="product.html?id=${g.id}" class="gear-card">
				<img src="${g.image?.url || ""}" alt="${g.image?.alt || "Gear"}" class="gear-image">
				<h3 class="gear-title">${g.title || "No title"}</h3>
				<p class="gear-price">€ ${g.price?.toFixed(2) || "N/A"}</p>
			</a>
	`)
		.join("");
}

// Checkout button
const checkoutBtn = document.getElementById("checkout-btn");

// Disable checkout button if cart is empty
if (checkoutBtn) {
	checkoutBtn.disabled = cart.length === 0;
}

if (checkoutBtn) {
	checkoutBtn.addEventListener("click", () => {
		if (cart.length === 0) {
			alert("Your cart is empty.");
			return;
		}
		
		window.location.href = "checkout.html";
	});
}