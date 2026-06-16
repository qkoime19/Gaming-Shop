const products = [];
let coins = 1200;
const inventory = [];

const productGrid = document.querySelector("#productGrid");
const inventoryList = document.querySelector("#inventoryList");
const coinCount = document.querySelector("#coinCount");

function updateCoins() {
  coinCount.textContent = coins;
}

function renderProducts() {
  productGrid.innerHTML = "";
}

function renderInventory() {
  inventoryList.innerHTML = "";

  if (inventory.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "inventory-empty";
    emptyItem.textContent = "No items yet.";
    inventoryList.appendChild(emptyItem);
  }
}

function initShop() {
  updateCoins();
  renderProducts();
  renderInventory();
}

initShop();
