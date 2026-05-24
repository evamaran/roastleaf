import { loginUser, saveUser, saveToken } from "../api/auth.js";

const form = document.querySelector("#loginForm");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const email = document.querySelector("#email").value.trim();
	const password = document.querySelector("#password").value.trim();

	try {
		// Login user
		const response = await loginUser({ email, password });
		const data = response.data;

		// Save token + user
		saveToken(data.accessToken);
		saveUser({ email: data.email });

		window.location.href = "profile.html";

	} catch (error) {
		console.error("❌ Login error:", error);
		message.textContent = error.message || "Login failed";
		message.style.color = "red";
	}
});