const baseUrl = "data/products.json";

export async function getProducts() {
	try {
		const response = await fetch(baseUrl);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error("Failed to load products:", error);
		return [];
	}
}