// Called from main.js after layout is loaded
export function initSearch() {
	const searchBar = document.getElementById("searchBar");
	const searchInput = document.getElementById("searchInput");
	const searchBtn = document.getElementById("searchBtn");
	const searchClose = document.getElementById("searchClose");
	const searchResults = document.getElementById("searchResults");
	const searchToggle = document.getElementById("searchToggle");

	if (!searchBar || !searchInput || !searchBtn || !searchClose || !searchResults || !searchToggle) return;

	function openSearch() {
		searchBar.classList.add("active");
		searchInput.focus();
	}

	searchToggle.addEventListener("click", () => {
		openSearch();
	});

	searchClose.addEventListener("click", () => {
		searchBar.classList.remove("active");
		searchInput.value = "";
		searchResults.innerHTML = "";
	});

	function filterProducts(query) {
		if (!query) return [];
		const products = window.products || [];
		return products.filter(p =>
			p.title.toLowerCase().includes(query.toLowerCase())
		);
	}

	function showResults(list) {
		if (list.length === 0) {
			searchResults.innerHTML = `<div>No results</div>`;
			return;
		}
		searchResults.innerHTML = list
			.map(item => `<div data-id="${item.id}">${item.title}</div>`)
			.join("");
	}

	searchInput.addEventListener("input", () => {
		const query = searchInput.value.trim();
		showResults(filterProducts(query));
	});

	searchBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		showResults(filterProducts(query));
		searchBar.classList.remove("active");
	});
}