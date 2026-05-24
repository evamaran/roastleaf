import { updateCartCount } from "../utils/cartUtils.js";
import { getProducts } from "../api/products.js";

export async function loadLayout() {
	// Load Font Awesome first so icons don't flash
	const fontAwesomeLoaded = new Promise(resolve => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";
		link.onload = resolve;
		document.head.appendChild(link);
	});

	// Load header + footer at the same time (faster)
	const [headerHtml, footerHtml] = await Promise.all([
		fetch("header.html").then(res => res.text()),
		fetch("footer.html").then(res => res.text()),
		fontAwesomeLoaded
	]);

	// Replace the entire placeholder element
	document.querySelector("header#header").innerHTML = headerHtml;

	// Update cart bubble after header is inserted
	updateCartCount();

	// Insert footer
	document.getElementById("footer").innerHTML = footerHtml;

	// Footer accordion
	document.querySelectorAll(".footer-toggle").forEach(button => {
		button.addEventListener("click", () => {
			button.parentElement.classList.toggle("open");
		});
	});

	// Profile redirect script
	import("./profileRedirect.js");

	// Search bar toggle
	const searchToggle = document.getElementById("searchToggle");
	const searchBar = document.getElementById("searchBar");
	const searchClose = document.getElementById("searchClose");

	if (searchToggle && searchBar && searchClose) {
		searchToggle.addEventListener("click", () => {
			searchBar.classList.toggle("active");
		});
		searchClose.addEventListener("click", () => {
			searchBar.classList.remove("active");
		});
	}

	// Mobile menu toggle
	const menuToggle = document.getElementById("menuToggle");
	const mobileNav = document.querySelector(".mobile-nav");

	if (menuToggle && mobileNav) {
		menuToggle.addEventListener("click", () => {
			mobileNav.classList.toggle("open");
		});
	}

	// Create global toast container once
	if (!document.getElementById("toast")) {
		const toast = document.createElement("div");
		toast.id = "toast";
		toast.className = "toast";
		document.body.appendChild(toast);
	}
}
