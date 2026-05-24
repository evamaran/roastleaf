// open + close search bar, handle input, show results, click results
export function initSearch() {
	const searchBar = document.getElementById("searchBar");
	const searchInput = document.getElementById("searchInput");
	const searchBtn = document.getElementById("searchBtn");
	const searchClose = document.getElementById("searchClose");
	const searchResults = document.getElementById("searchResults");
	const searchToggle = document.getElementById("searchToggle");

	if (!searchBar || !searchInput || !searchBtn || !searchClose || !searchResults || !searchToggle) return;

	// open the search bar when clicking the icon
	function openSearch() {
		searchBar.classList.add("active");
		searchInput.focus();
	}

	searchToggle.addEventListener("click", () => {
		openSearch();
	});

	// close search bar and reset everything
	searchClose.addEventListener("click", () => {
		searchBar.classList.remove("active");
		searchInput.value = "";
		searchResults.innerHTML = "";
	});

	// filter products by title
	function filterProducts(query) {
		if (!query) return [];
		const products = window.products || [];
		return products.filter(p =>
			p.title.toLowerCase().includes(query.toLowerCase())
		);
	}

	// show the filtered results under the search bar
	function showResults(list) {
		if (list.length === 0) {
			searchResults.innerHTML = `<div>No results</div>`;
			return;
		}
		searchResults.innerHTML = list
			.map(item => `<div data-id="${item.id}">${item.title}</div>`)
			.join("");
	}

	// update results while typing
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.trim();
		showResults(filterProducts(query));
	});

	// run search when clicking the search button
	searchBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		showResults(filterProducts(query));
		searchBar.classList.remove("active");
	});

	// go to product page when clicking a result
	searchResults.addEventListener("click", (e) => {
		const item = e.target.closest("div[data-id]");
		if (!item) return;

		const id = item.getAttribute("data-id");
		window.location.href = `product.html?id=${id}`;
	});
}
