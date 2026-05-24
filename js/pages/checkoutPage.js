// get cart from localStorage (fallback to empty array)
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// load products to match cart items
let productsData = [];

fetch("../data/products.json")
	.then(res => res.json())
	.then(products => {
		productsData = products;
		renderOrderSummary();
	});

// show products in the order summary
function renderOrderSummary() {
	const summarySection = document.querySelector(".summary");

	summarySection.innerHTML = `
        <h2>Order Summary</h2>
    `;

	let total = 0;

	cart.forEach(item => {
		const product = productsData.find(p => p.id === item.id);
		if (!product) return;

		const itemHTML = `
			<div class="summary-item">
				<img src="${product.image.url}" alt="${product.image.alt}">
				<p>${product.title}</p>
				<span>€ ${(product.price * item.quantity).toFixed(2)}</span>
			</div>
		`;

		summarySection.insertAdjacentHTML("beforeend", itemHTML);

		total += product.price * item.quantity;
	});

	summarySection.insertAdjacentHTML(
		"beforeend",
		`
		<div class="summary-total">
			<p>Total</p>
			<span>€ ${total.toFixed(2)}</span>
		</div>

		<button id="pay-now">Pay Now</button>
		`
	);
}


// prefill user info before validation
const profile = JSON.parse(localStorage.getItem("userProfile")) || {};

const fields = [
	"firstName",
	"lastName",
	"address",
	"city",
	"postalCode",
	"countryCode",
	"phone"
];

fields.forEach(id => {
	const el = document.getElementById(id);
	if (el && profile[id]) {
		el.value = profile[id];
	}
});

// Payment accordion
function setupPaymentAccordion() {
	const radios = document.querySelectorAll('input[name="payment"]');
	const contents = document.querySelectorAll(".payment-content");

	function updateAccordion() {
		const selected = document.querySelector('input[name="payment"]:checked').value;

		contents.forEach(section => {
			if (section.dataset.method === selected) {
				section.classList.add("active");
			} else {
				section.classList.remove("active");
			}
		});
	}

	radios.forEach(radio => {
		radio.addEventListener("change", updateAccordion);
	});

	updateAccordion(); // initialize on page load
}
setupPaymentAccordion();

// check if required fields are filled
function validateCheckout() {
	const form = document.querySelector("#checkout-form");

	if (!form.checkValidity()) {
		alert("Please fill out all required fields.");
		return false;
	}

	return true;
}

// handle payment click
function handlePayment() {
	if (!validateCheckout()) return;

	// Show toast notification
	const toast = document.getElementById("toast");
	toast.textContent = "Payment successful!";
	toast.classList.add("show");

	setTimeout(() => {
		toast.classList.remove("show");
	}, 3000);

	// Generate random 6-digit order number
	const orderNumber = Math.floor(100000 + Math.random() * 900000);
	localStorage.setItem("orderNumber", orderNumber);

	// clear cart after payment
	localStorage.removeItem("cart");

	// go to confirmation page
	window.location.href = "confirmation.html";
}

// run summary on page load
renderOrderSummary();

// listen for pay button
document.addEventListener("click", (e) => {
	if (e.target.id === "pay-now") {
		handlePayment();
	}
});
