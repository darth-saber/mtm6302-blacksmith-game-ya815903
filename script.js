let gold = 10,
  ore = 0,
  wood = 0,
  fireBurning = false,
  weapons = [];
const logDiv = document.getElementById("log");
const fireAnim = document.getElementById("fireAnim");
const inventoryItems = document.getElementById("inventoryItems");
let sparkInterval = null;

function log(message) {
  logDiv.innerHTML += message + "<br>";
  logDiv.scrollTop = logDiv.scrollHeight;
}

function updateInventory() {
  let html = `<p>Gold: ${gold} | Ore: ${ore} | Wood: ${wood} | Fire: ${fireBurning ? "🔥" : "❌"}</p>`;
  html += weapons.length
    ? weapons.map((w) => `<span class="weapon ${w}">${w}</span>`).join(" ")
    : "No weapons";
  inventoryItems.innerHTML = html;
}

function spawnSparks() {
  if (!fireBurning) return;
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
  const price = item === "ore" ? 3 : 1;
  if (gold >= price) {
    gold -= price;
    item === "ore" ? ore++ : wood++;
    log(`Bought 1 ${item}.`);
  } else log("Not enough gold!");
  updateInventory();
}

function fireToggle() {
  if (fireBurning) {
    fireBurning = false;
    fireAnim.style.display = "none";
    log("Fire stopped.");
    clearInterval(sparkInterval);
    sparkInterval = null;
  } else {
    if (wood >= 1) {
      wood--;
      fireBurning = true;
      fireAnim.style.display = "block";
      log("Fire started.");
      if (!sparkInterval) sparkInterval = setInterval(spawnSparks, 300);
    } else log("Not enough wood to start fire!");
  }
  updateInventory();
}

function make(item) {
  if (!fireBurning) {
    log("Fire must be burning to make weapons!");
    return;
  }
  const recipe = item === "sword" ? { ore: 2, wood: 1 } : { ore: 1, wood: 2 };
  if (ore >= recipe.ore && wood >= recipe.wood) {
    ore -= recipe.ore;
    wood -= recipe.wood;
    weapons.push(item);
    log(`Made 1 ${item}`);
    spawnSparks();
  } else log("Not enough resources!");
  updateInventory();
}

function sell(item) {
  if (fireBurning) {
    log("Cannot sell while fire is burning!");
    return;
  }
  const idx = weapons.indexOf(item);
  if (idx >= 0) {
    weapons.splice(idx, 1);
    const earned =
      Math.floor(
        Math.random() *
          ((item === "sword" ? 10 : 8) - (item === "sword" ? 5 : 4) + 1),
      ) + (item === "sword" ? 5 : 4);
    gold += earned;
    log(`Sold 1 ${item} for ${earned} gold.`);
  } else log(`No ${item} to sell!`);
  updateInventory();
}

function showInventory() {
  updateInventory();
}

function showHelp() {
  log(
    "Commands: Buy Ore/Wood, Make Sword/Axe, Sell Sword/Axe, Toggle Fire, Show Inventory, Help",
  );
}

// Bind buttons
document.getElementById("buyOre").onclick = () => buy("ore");
document.getElementById("buyWood").onclick = () => buy("wood");
document.getElementById("toggleFire").onclick = () => fireToggle();
document.getElementById("makeSword").onclick = () => make("sword");
document.getElementById("makeAxe").onclick = () => make("axe");
document.getElementById("sellSword").onclick = () => sell("sword");
document.getElementById("sellAxe").onclick = () => sell("axe");
document.getElementById("showInv").onclick = () => showInventory();
document.getElementById("showHelp").onclick = () => showHelp();

log("Welcome to Blacksmith! Use the buttons to play.");
updateInventory();
