const products = [
  {
    id: 1,
    name: "Shadow Blade",
    price: 350,
    description: "Fast melee skin for stealth players.",
    image: "assets/shadow-blade.svg",
    rarity: "Epic"
  },
  {
    id: 2,
    name: "Neon Rifle",
    price: 520,
    description: "Bright rifle skin with clean futuristic lines.",
    image: "assets/neon-rifle.svg",
    rarity: "Legendary"
  },
  {
    id: 3,
    name: "Frost Shield",
    price: 280,
    description: "Defensive item with icy blue details.",
    image: "assets/frost-shield.svg",
    rarity: "Rare"
  },
  {
    id: 4,
    name: "Cyber Helmet",
    price: 420,
    description: "Avatar helmet for ranked matches.",
    image: "assets/cyber-helmet.svg",
    rarity: "Common"
  }
];

let coins = 1200;
const inventory = [];

const productGrid = document.querySelector("#productGrid");
const inventoryList = document.querySelector("#inventoryList");
const coinCount = document.querySelector("#coinCount");
const shopMessage = document.querySelector("#shopMessage");

function updateCoins() {
  coinCount.textContent = coins;
}

function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img class="product-art" src="${product.image}" alt="${product.name}">
      <span class="rarity rarity-${product.rarity.toLowerCase()}">${product.rarity}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-meta">
        <span class="product-price">${product.price} coins</span>
      </div>
      <button class="buy-button" type="button" data-product-id="${product.id}">BUY</button>
    `;
    productGrid.appendChild(card);
  });
}

function renderInventory() {
  inventoryList.innerHTML = "";

  if (inventory.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "inventory-empty";
    emptyItem.textContent = "No items yet.";
    inventoryList.appendChild(emptyItem);
    return;
  }

  inventory.forEach((item) => {
    const inventoryItem = document.createElement("li");
    inventoryItem.className = "inventory-item";
    inventoryItem.innerHTML = `
      <span>${item.name}</span>
      <span class="rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span>
    `;
    inventoryList.appendChild(inventoryItem);
  });
}

function buyProduct(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  if (coins < product.price) {
    shopMessage.textContent = `Not enough coins for ${product.name}.`;
    return;
  }

  coins -= product.price;
  inventory.push(product);
  shopMessage.textContent = `${product.name} was added to your inventory.`;

  updateCoins();
  renderInventory();
}

productGrid.addEventListener("click", (event) => {
  const buyButton = event.target.closest(".buy-button");

  if (!buyButton) {
    return;
  }

  buyProduct(Number(buyButton.dataset.productId));
});
}

function initShop() {
  updateCoins();
  renderProducts();
  renderInventory();
}

initShop();
