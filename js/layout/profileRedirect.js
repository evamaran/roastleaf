import { isLoggedIn } from "../api/auth.js";

// this file is loaded AFTER the header is inserted into the DOM
// so the elements exist when this runs

const profileBtn = document.querySelector("#profile-icon");
const profileMobile = document.querySelector("#profile-link-mobile");

// function that decides where to send the user
function handleProfileClick(event) {
	event.preventDefault(); // stop default button behavior

	if (isLoggedIn()) {
		// user is logged in → go to profile page
		window.location.href = "profile.html";
	} else {
		// user is not logged in → go to login page
		window.location.href = "login.html";
	}
}

// attach listeners if elements exist
if (profileBtn) {
	profileBtn.addEventListener("click", handleProfileClick);
}

if (profileMobile) {
	profileMobile.addEventListener("click", handleProfileClick);
}