const API_URL = "https://dummyjson.com/products?limit=100";

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const status = document.getElementById("status");

let allProducts = [];

// 1. Fetch products from API
async function fetchProducts() {
  try {
    status.textContent = "Loading products...";

    const response = await fetch(API_URL);
    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    console.log(data);

    allProducts = data.products;

    // Populate categories
    loadCategories();

    // Display all products initially
    displayProducts(allProducts);
  } catch (error) {
    status.textContent = "Error: " + error.message;
  }
}

// 2. Load categories dynamically
function loadCategories() {
  const categories = [
    ...new Set(allProducts.map((product) => product.category)),
  ];

  categories.sort();

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categorySelect.appendChild(option);
  });
}

// 3. Display products on the UI
function displayProducts(products) {
  productsContainer.innerHTML = "";

  status.textContent = products.length + " products found";

  if (products.length === 0) {
    status.textContent = "No products found!";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;

    const title = document.createElement("h3");
    title.textContent = product.title;

    const category = document.createElement("p");
    category.className = "category";
    category.textContent = "Category: " + product.category;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = "$" + product.price;

    const rating = document.createElement("p");
    rating.className = "rating";
    rating.textContent = "⭐ " + product.rating;

    // const addToCart=document.createElement('button');
    // addToCart.className="addToCart";
    // addToCart.textContent='addToCart';

    // const buyNow=document.createElement('button');
    // buyNow.className='buyNow';
    // buyNow.textContent='buyNow'

    const addButton = document.createElement("button");
    addButton.className = "add-to-cart";
    addButton.textContent = "Add to Cart";

    addButton.addEventListener("click", () => {
      addToCart(product);
    });

    
// Buy Now button
const buyButton = document.createElement("button");
buyButton.className = "buy-now";
buyButton.textContent = "Buy Now";

buyButton.addEventListener("click", () => {
  addToCart(product);
  window.location.href = "cart.html";
});


    card.append(image, title, category, description, price, rating,addButton,buyButton);

    productsContainer.appendChild(card);
  });
}

// 4. Search + Filter + Sort
function applyFilters() {
  const searchText = searchInput.value.trim().toLowerCase();

  const selectedCategory = categorySelect.value;
  const selectedSort = sortSelect.value;

  // SEARCH
  let filteredProducts = allProducts.filter((product) => {
    return product.title.toLowerCase().includes(searchText);
  });

  // FILTER BY CATEGORY
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter((product) => {
      return product.category === selectedCategory;
    });
  }

  // SORT
  if (selectedSort === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === "rating") {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else if (selectedSort === "az") {
    filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Display final result
  displayProducts(filteredProducts);
}

// 5. Add event listeners
searchInput.addEventListener("input", applyFilters);

categorySelect.addEventListener("change", applyFilters);

sortSelect.addEventListener("change", applyFilters);

// Start the application
fetchProducts();



// Get cart items from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Add product to cart
function addToCart(product) {
  let cart = getCart();

  const existingProduct = cart.find(
    (item) => item.id === product.id
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  alert(`${product.title} added to cart!`);
}

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");

  if (cartCount) {
    const totalItems = getCart().reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartCount.textContent = totalItems;
  }
}

// Run when the product page loads
updateCartCount();