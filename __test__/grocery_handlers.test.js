const { getItems, addItem, updateItem, deleteItem } = require("../grocery_handlers");

describe("Grocery Handlers", () => {
  test("GET returns items", () => {
    const result = getItems();
    expect(Array.isArray(result)).toBe(true);
  });

  test("POST validates input", () => {
    const result = addItem({});
    expect(result.status).toBe(400);
  });

  test("POST adds item", () => {
    const result = addItem({ name: "Apple", quantity: 2, price: 3 });
    expect(result.status).toBe(200);
    expect(result.body.name).toBe("Apple");
  });

  test("PUT updates item", () => {
    addItem({ name: "Potato", quantity: 1, price: 2 });
    const result = updateItem(0, { name: "Potato", quantity: 3, price: 12, purchased: true });
    expect(result.status).toBe(200);
    expect(result.body.currentItem.name).toBe("Potato");
  });

  test("DELETE removes item", () => {
    const result = deleteItem(0);
    expect(result.status).toBe(200);
  });
});
