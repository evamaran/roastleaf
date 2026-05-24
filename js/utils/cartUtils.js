// update cart badge in header
export function updateCartCount() {
  // get cart
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // count items
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  // find badge
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  // update number
  countEl.textContent = count;

  // show/hide badge
  countEl.style.display = count > 0 ? "flex" : "none";

  // pop animation
  countEl.classList.remove("pop");
  void countEl.offsetWidth; // reset trick
  countEl.classList.add("pop");
}