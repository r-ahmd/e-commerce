const cartContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const shippingElement = document.getElementById('shipping-cost');
const discountElement = document.getElementById('discount-amount');

let cart = [];
let shippingCost = 5;
let discount = 0;

// Update Cart UI
function updateCartUI() {
  cartContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <div>${item.name}</div>
      <div>
        <button onclick="decreaseQuantity(${index})">-</button>
        ${item.quantity}
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
      <div>$${(item.price * item.quantity).toFixed(2)}</div>
    `;

    cartContainer.appendChild(cartItem);
  });

  updateTotal();
}

// Update Total Calculation
function updateTotal() {
  let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let total = subtotal + shippingCost - discount;
  totalPriceElement.textContent = total.toFixed(2);
  discountElement.textContent = discount.toFixed(2);
  shippingElement.textContent = shippingCost.toFixed(2);
}

// Coupon Code
function applyCoupon() {
  const code = document.getElementById('coupon').value.trim();
  if (code === "SAVE10") {
    discount = 10;
    alert("Coupon applied! $10 off.");
  } else {
    discount = 0;
    alert("Invalid coupon code.");
  }
  updateTotal();
}

// Quantity Controls
function increaseQuantity(index) {
  cart[index].quantity++;
  updateCartUI();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// Product Load + Cart Button Setup
document.addEventListener("DOMContentLoaded", () => {
  const productList = document.querySelector(".product-list");

  fetch("products.json")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product");
        productCard.setAttribute("data-name", product.name);
        productCard.setAttribute("data-price", product.price);

        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h4>${product.name}</h4>
          <p>$${product.price}</p>
          <button class="add-to-cart">Add to Cart</button>
        `;

        productList.appendChild(productCard);
      });

      // ✅ Attach event listeners after buttons exist
      setupAddToCartButtons();
    })
    .catch((error) => console.error("Error loading products:", error));
});

// Set up Add to Cart buttons dynamically
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const product = button.parentElement;
      const name = product.dataset.name;
      const price = parseFloat(product.dataset.price);

      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCartUI();
      alert(`${name} added to cart!`);
    });
  });
}
