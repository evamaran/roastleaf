// Base URL for all auth endpoints
const baseUrl = "https://v2.api.noroff.dev/auth";

// Register new user
export async function registerUser(userData) {
	console.log("📨 Sending to API:", userData);

	const response = await fetch(`${baseUrl}/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});

	console.log("📥 Response status:", response.status);

	const data = await response.json();
	console.log("📥 Response body:", data);

	if (!response.ok) {
		throw new Error(data.errors?.[0]?.message || "Registration failed");
	}

	return data;
}


// Log in user
export async function loginUser(credentials) {
	const response = await fetch(`${baseUrl}/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.errors?.[0]?.message || "Login failed");
	}

	// Save token
	if (data.accessToken) {
		localStorage.setItem("token", data.accessToken);
	}

	// ⭐ Noroff v2 API returns user info inside data.data
	const userData = data.data || {};

	// Save basic user info
	if (userData.name || userData.email) {
		saveUser({
			name: userData.name,
			email: userData.email,
		});
	}

	return data;
}

// Save user info (name + email)
export function saveUser(user) {
	localStorage.setItem("user", JSON.stringify(user));
}

// Save token
export function saveToken(token) {
	localStorage.setItem("token", token);
}

// Get user info
export function getUser() {
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
}

// Get token
export function getToken() {
	return localStorage.getItem("token");
}

// Check if user is logged in
export function isLoggedIn() {
	return getToken() !== null;
}

// Log out user
export function logout() {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
}