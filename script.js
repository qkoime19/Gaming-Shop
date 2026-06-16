const products = [
  {
    id: 1,
    name: "Shadow Blade",
    price: 350,
    description: "Fast melee skin for stealth players.",
    image: "assets/shadow-blade.svg",
    rarity: "Epic",
    category: "Weapons",
    discount: 10,
    limited: false
  },
  {
    id: 2,
    name: "Neon Rifle",
    price: 520,
    description: "Bright rifle skin with clean futuristic lines.",
    image: "assets/neon-rifle.svg",
    rarity: "Legendary",
    category: "Weapons",
    discount: 25,
    limited: true
  },
  {
    id: 3,
    name: "Frost Shield",
    price: 280,
    description: "Defensive item with icy blue details.",
    image: "assets/frost-shield.svg",
    rarity: "Rare",
    category: "Armor",
    discount: 0,
    limited: false
  },
  {
    id: 4,
    name: "Cyber Helmet",
    price: 420,
    description: "Avatar helmet for ranked matches.",
    image: "assets/cyber-helmet.svg",
    rarity: "Common",
    category: "Armor",
    discount: 0,
    limited: false
  },
  {
    id: 5,
    name: "Dragon Gloves",
    price: 260,
    description: "Fire gloves that boost the player style score.",
    image: "assets/dragon-gloves.svg",
    rarity: "Rare",
    category: "Cosmetics",
    discount: 50,
    limited: true
  },
  {
    id: 6,
    name: "Ember Cape",
    price: 180,
    description: "Animated cape with warm ember colors.",
    image: "assets/ember-cape.svg",
    rarity: "Common",
    category: "Cosmetics",
    discount: 0,
    limited: false
  }
];

const rarityOrder = {
  Legendary: 4,
  Epic: 3,
  Rare: 2,
  Common: 1
};

let coins = 1200;
const inventory = [];

const productGrid = document.querySelector("#productGrid");
const inventoryList = document.querySelector("#inventoryList");
const coinCount = document.querySelector("#coinCount");
const shopMessage = document.querySelector("#shopMessage");
const lootBoxButton = document.querySelector("#lootBoxButton");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const sortSelect = document.querySelector("#sortSelect");
const productTotal = document.querySelector("#productTotal");
const inventoryCount = document.querySelector("#inventoryCount");

function getFinalPrice(product) {
  return Math.round(product.price * (1 - product.discount / 100));
}

function updateCoins() {
  coinCount.textContent = coins;
}

function updateStats() {
  const totalItems = inventory.reduce((total, slot) => total + slot.quantity, 0);

  productTotal.textContent = products.length;
  inventoryCount.textContent = totalItems;
}

function populateCategories() {
  const categories = [...new Set(products.map((product) => product.category))].sort();

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function getVisibleProducts() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortSelect.value;

  const visibleProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue) ||
      product.rarity.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (selectedSort === "price-low") {
    visibleProducts.sort((first, second) => getFinalPrice(first) - getFinalPrice(second));
  }

  if (selectedSort === "price-high") {
    visibleProducts.sort((first, second) => getFinalPrice(second) - getFinalPrice(first));
  }

  if (selectedSort === "rarity") {
    visibleProducts.sort((first, second) => rarityOrder[second.rarity] - rarityOrder[first.rarity]);
  }

  return visibleProducts;
}

function createPriceMarkup(product) {
  const finalPrice = getFinalPrice(product);

  if (product.discount === 0) {
    return `<span class="product-price">${finalPrice} coins</span>`;
  }

  return `
    <span class="product-price">${finalPrice} coins</span>
    <span class="old-price">${product.price}</span>
    <span class="discount-badge">-${product.discount}%</span>
  `;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = "";

  if (visibleProducts.length === 0) {
    const emptyResult = document.createElement("p");
    emptyResult.className = "empty-result";
    emptyResult.textContent = "No matching items.";
    productGrid.appendChild(emptyResult);
    return;
  }

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = `product-card product-card-${product.rarity.toLowerCase()}`;
    card.innerHTML = `
      <div class="product-image-wrap">
        <img class="product-art" src="${product.image}" alt="${product.name}">
        ${product.limited ? '<span class="limited-badge">Limited</span>' : ""}
      </div>
      <div class="product-badges">
        <span class="rarity rarity-${product.rarity.toLowerCase()}">${product.rarity}</span>
        <span class="category-badge">${product.category}</span>
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-meta">
        <div class="price-row">${createPriceMarkup(product)}</div>
      </div>
      <button class="buy-button" type="button" data-product-id="${product.id}">BUY</button>
    `;
    productGrid.appendChild(card);
  });
}

function addToInventory(product) {
  const existingSlot = inventory.find((slot) => slot.item.id === product.id);

  if (existingSlot) {
    existingSlot.quantity += 1;
    return;
  }

  inventory.push({
    item: product,
    quantity: 1
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

  inventory.forEach((slot) => {
    const inventoryItem = document.createElement("li");
    inventoryItem.className = "inventory-item";
    inventoryItem.innerHTML = `
      <span class="inventory-name">${slot.item.name}</span>
      <span class="inventory-quantity">x${slot.quantity}</span>
      <span class="rarity rarity-${slot.item.rarity.toLowerCase()}">${slot.item.rarity}</span>
    `;
    inventoryList.appendChild(inventoryItem);
  });
}

function buyProduct(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const price = getFinalPrice(product);

  if (coins < price) {
    shopMessage.textContent = `Not enough coins for ${product.name}.`;
    return;
  }

  coins -= price;
  addToInventory(product);
  shopMessage.textContent = `${product.name} was added to your inventory.`;

  updateCoins();
  updateStats();
  renderInventory();
}

function openLootBox() {
  const randomIndex = Math.floor(Math.random() * products.length);
  const randomItem = products[randomIndex];

  addToInventory(randomItem);
  shopMessage.textContent = `Loot box unlocked ${randomItem.name}.`;
  updateStats();
  renderInventory();
}

function initShop() {
  populateCategories();
  updateCoins();
  updateStats();
  renderProducts();
  renderInventory();
}

productGrid.addEventListener("click", (event) => {
  const buyButton = event.target.closest(".buy-button");

  if (!buyButton) {
    return;
  }

  buyProduct(Number(buyButton.dataset.productId));
});

lootBoxButton.addEventListener("click", openLootBox);
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

initShop();
