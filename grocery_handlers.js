const fs = require("fs");
const { logger } = require("./logger");

let data = JSON.parse(fs.readFileSync("data.json", "utf8"));

function getItems() {
  return data.grocery_list;
}

function addItem({ name, quantity, price }) {
  if (!name || !quantity || !price) {
    return { status: 400, body: { message: "Please provide a valid name,quantity and price" } };
  }

  const newItem = { name, quantity, price, purchased: false };
  data.grocery_list.push(newItem);

  fs.writeFileSync("data.json", JSON.stringify(data), "utf8");
  logger.info("Item created", { newItem });

  return { status: 200, body: { message: "Item added to list", ...newItem } };
}

function updateItem(index, { name, quantity, price, purchased }) {
  const currentItem = data.grocery_list[index];

  if (!currentItem) {
    return { status: 404, body: { message: `Item ${index} not found` } };
  }

  currentItem.name = name;
  currentItem.quantity = quantity;
  currentItem.price = price;
  currentItem.purchased = purchased;

  fs.writeFileSync("data.json", JSON.stringify(data), "utf8");
  logger.info("Item updated", { index, currentItem });

  return { status: 200, body: { message: `Item ${index} Updated`, currentItem } };
}

function deleteItem(index) {
  if (!data.grocery_list[index]) {
    return { status: 404, body: { message: `Item ${index} not found` } };
  }

  data.grocery_list.splice(index, 1);
  fs.writeFileSync("data.json", JSON.stringify(data), "utf8");
  logger.info("Item deleted", { index });

  return { status: 200, body: { message: `Item ${index} deleted` } };
}

module.exports = { getItems, addItem, updateItem, deleteItem };
