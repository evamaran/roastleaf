import { registerUser, loginUser, saveUser, saveToken } from "../api/auth.js";

const form = document.querySelector("#registerForm");
const message = document.querySelector("#message");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const firstName = document.querySelector("#firstName").value.trim();
	const lastName = document.querySelector("#lastName").value.trim();
	const email = document.querySelector("#email").value.trim();
	const password = document.querySelector("#password").value.trim();

	const profileData = {
		firstName,
		lastName,
		email,
		address: document.querySelector("#address").value.trim(),
		postalCode: document.querySelector("#postalCode").value.trim(),
		city: document.querySelector("#city").value.trim(),
		countryCode: document.querySelector("#countryCode").value,
		phone: document.querySelector("#phone").value.trim()
	};

	// Save profile locally
	localStorage.setItem("userProfile", JSON.stringify(profileData));

	const userData = {
		name: `${firstName}_${lastName}`.replace(/\s+/g, "_"),
		email,
		password,
	};

	try {
		// Register user
		await registerUser(userData);

		// Login user
		const loginResponse = await loginUser({ email, password });

		saveToken(loginResponse.data.accessToken);
		saveUser({ email: loginResponse.data.email });

		message.textContent = "Registration successful! Redirecting...";
		message.style.color = "green";

		setTimeout(() => {
			window.location.href = "profile.html";
		}, 1200);

	} catch (error) {
		message.textContent = error.message || "Registration failed";
		message.style.color = "red";
	}
});