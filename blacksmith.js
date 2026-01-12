let gold = 10;
let ore = 0;
let wood = 0;
let fireBurning = false;
let weapons = [];

const logDiv = document.getElementById("log");
const fireAnim = document.getElementById("fireAnim");
const inventoryItems = document.getElementById("inventoryItems");

const buySound = document.getElementById("buySound");
const sellSound = document.getElementById("sellSound");
const fireSound = document.getElementById("fireSound");
const craftSound = document.getElementById("craftSound");

const BUY_PRICES = { ore: 3, wood: 1 };
const MAKE_RECIPES = { sword: { ore: 2, wood: 1 }, axe: { ore: 1, wood: 2 } };
const SELL_PRICES = { sword: [5, 10], axe: [4, 8] };

function log(message) {
  logDiv.innerHTML += message + "<br>";
  logDiv.scrollTop = logDiv.scrollHeight;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function updateInventory() {
  let html = `<p>Gold: ${gold} | Ore: ${ore} | Wood: ${wood} | Fire: ${fireBurning ? "🔥" : "❌"}</p>`;
  html += weapons.length
    ? weapons.map((w) => `<span class="weapon ${w}">${w}</span>`).join(" ")
    : "No weapons";
  inventoryItems.innerHTML = html;
}

function spawnSparks() {
  for (let i = 0; i < 5; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = Math.random() * 50 + "px";
    spark.style.setProperty("--x", Math.random() * 20 - 10 + "px");
    fireAnim.appendChild(spark);
    setTimeout(() => spark.remove(), 500);
  }
}

function buy(item) {
  if (fireBurning) {
    log("Cannot buy while fire is burning!");
    return;
  }
  if (!BUY_PRICES[item]) {
    log("Invalid item to buy!");
    return;
  }
  if (gold >= BUY_PRICES[item]) {
    gold -= BUY_PRICES[item];
    if (item === "ore") ore++;
    else if (item === "wood") wood++;
    log(`Bought 1 ${item}.`);
    playSound(buySound);
  } else log("Not enough gold!");
  updateInventory();
}

function fireToggle() {
  if (fireBurning) {
    fireBurning = false;
    fireAnim.style.display = "none";
    log("Fire stopped.");
  } else {
    if (wood >= 1) {
      wood--;
      fireBurning = true;
      fireAnim.style.display = "block";
      log("Fire started.");
      playSound(fireSound);
      setInterval(() => {
        if (fireBurning) spawnSparks();
      }, 300);
    } else log("Not enough wood to start fire!");
  }
  updateInventory();
}

function make(item) {
  if (!fireBurning) {
    log("Fire must be burning to make weapons!");
    return;
  }
  if (!MAKE_RECIPES[item]) {
    log("Invalid weapon!");
    return;
  }
  const recipe = MAKE_RECIPES[item];
  if (ore >= recipe.ore && wood >= recipe.wood) {
    ore -= recipe.ore;
    wood -= recipe.wood;
    weapons.push(item);
    log(`Made 1 ${item}.`);
    playSound(craftSound);
    spawnSparks();
  } else log("Not enough resources!");
  updateInventory();
}

function sell(item) {
  if (fireBurning) {
    log("Cannot sell while fire is burning!");
    return;
  }
  const index = weapons.indexOf(item);
  if (index >= 0) {
    weapons.splice(index, 1);
    const [min, max] = SELL_PRICES[item];
    const earned = Math.floor(Math.random() * (max - min + 1)) + min;
    gold += earned;
    log(`Sold 1 ${item} for ${earned} gold.`);
    playSound(sellSound);
  } else log(`No ${item} to sell!`);
  updateInventory();
}

function showInventory() {
  updateInventory();
}
function showHelp() {
  log(`Commands:
Buy Ore/Wood
Make Sword/Axe
Sell Sword/Axe
Toggle Fire
Show Inventory
Help`);
}

// Initialize
log("Welcome to Blacksmith! Use the buttons to play.");
updateInventory();
