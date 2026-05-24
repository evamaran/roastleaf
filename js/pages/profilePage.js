import { getUser, getToken, logout } from "../api/auth.js";

document.addEventListener("DOMContentLoaded", () => {
	const user = getUser();
	const token = getToken();
	let profile = JSON.parse(localStorage.getItem("userProfile"));
	const message = document.querySelector("#message");

	// Redirect if not logged in
	if (!token) {
		window.location.href = "login.html";
	}

	if (!user) {
		message.textContent = "User data missing. Please log in again.";
		message.style.color = "red";
		return;
	}
	//This is a test to see if data is commited to git
	// Create default profile if missing
	if (!profile) {
		message.textContent = "Profile data missing. Please register again.";
		message.style.color = "red";
		return;
	}

	// Fill in profile fields
	document.querySelector("#firstName").value = profile.firstName;
	document.querySelector("#lastName").value = profile.lastName;
	document.querySelector("#address").value = profile.address;
	document.querySelector("#postalCode").value = profile.postalCode;
	document.querySelector("#city").value = profile.city;
	document.querySelector("#countryCode").value = profile.countryCode;
	document.querySelector("#phone").value = profile.phone;
	document.querySelector("#email").value = profile.email;
 
	// Save profile changes
	document.querySelector("#profileForm").addEventListener("submit", (event) => {
		event.preventDefault();

		const updatedProfile = {
			firstName: document.querySelector("#firstName").value.trim(),
			lastName: document.querySelector("#lastName").value.trim(),
			address: document.querySelector("#address").value.trim(),
			postalCode: document.querySelector("#postalCode").value.trim(),
			city: document.querySelector("#city").value.trim(),
			countryCode: document.querySelector("#countryCode").value.trim(),
			phone: document.querySelector("#phone").value.trim(),
			email: user.email
		};

		localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

		message.textContent = "Profile updated!";
		message.style.color = "green";
	});

	// Logout button
	document.querySelector("#logoutBtn")?.addEventListener("click", () => {
		logout(); // deletes token
		window.location.href = "login.html";
	});
});