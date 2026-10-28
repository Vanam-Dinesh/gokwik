const cartItemsContainer = document.getElementById("cart-items");
const totalItemsElement = document.getElementById("total-items");
const totalPriceElement = document.getElementById("total-price");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Display cart products
function displayCart() {
  const cart = getCart();

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty!</h2>
        <p>Add some products to get started.</p>
        <a href="index.html">Continue Shopping</a>
      </div>
    `;
  }

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const image = document.createElement("img");
    image.src = item.thumbnail;
    image.alt = item.title;

    const details = document.createElement("div");
    details.className = "item-details";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const price = document.createElement("p");
    price.className = "item-price";
    price.textContent = `$${item.price.toFixed(2)} each`;

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "-";
    decreaseButton.setAttribute("aria-label", `Decrease ${item.title} quantity`);

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.setAttribute("aria-label", `Increase ${item.title} quantity`);

    decreaseButton.addEventListener("click", () => {
      changeQuantity(item.id, -1);
    });

    increaseButton.addEventListener("click", () => {
      changeQuantity(item.id, 1);
    });

    quantityControls.append(
      decreaseButton,
      quantity,
      increaseButton
    );

    const subtotal = document.createElement("p");
    subtotal.textContent =
      `Subtotal: $${(item.price * item.quantity).toFixed(2)}`;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      removeItem(item.id);
    });

    details.append(
      title,
      price,
      quantityControls,
      subtotal
    );

    cartItem.append(image, details, removeButton);
    cartItemsContainer.appendChild(cartItem);
  });

  // Calculate totals
  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  totalItemsElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Increase or decrease quantity
function changeQuantity(id, change) {
  let cart = getCart();

  const item = cart.find((product) => product.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== id);
  }

  saveCart(cart);
  displayCart();
}

// Remove a product
function removeItem(id) {
  const cart = getCart().filter(
    (item) => item.id !== id
  );

  saveCart(cart);
  displayCart();
}

// Clear all cart items
document.getElementById("clear-cart").addEventListener("click", () => {
  if (getCart().length === 0) return;

  if (confirm("Are you sure you want to clear the cart?")) {
    saveCart([]);
    displayCart();
  }
});

// Demo checkout action
document.getElementById("checkout").addEventListener("click", () => {
  if (getCart().length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Cart ready! Connect a payment gateway to complete checkout.");
});

displayCart();