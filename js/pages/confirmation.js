// Get order number on confirmation page

const orderNumber = localStorage.getItem("orderNumber");

document.querySelector("#orderNumber").textContent = orderNumber || "N/A";

// Remove order number from localStorage after displaying it
localStorage.removeItem("orderNumber");