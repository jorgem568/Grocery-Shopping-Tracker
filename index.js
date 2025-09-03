// Import the readline module for handling user input in the console
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout, // Write to standard output (console)
});

const groceryList = [];

function showGroceryList() {
  console.log("\nGrocery List:");
  if (groceryList.length < 1) {
    console.log("List is Empty");
  } else {
    console.log(
      "#".padEnd(4) +
        "Items".padEnd(12) +
        "Quantity".padEnd(10) +
        "Price".padEnd(10) +
        "Bought"
    );
    groceryList.forEach((item, index) => {
      console.log(
        `${index + 1}. `.padEnd(4) +
          item.name.padEnd(12) +
          String(item.quantity).padEnd(10) +
          `$${String(item.price).padEnd(10)}` +
          String(item.bought)
      );
    });
  }
}

function groceryShopping() {
  rl.once("close", () => {
    // end of input
    console.log("\nGoodbye");
  });

  console.log("\n------------ Menu ------------");
  console.log("1. Display grocery list");
  console.log("2. Add Items to grocery list");
  console.log("3. Remove items from the grocery list");
  console.log("4. Mark bought items");

  rl.question("Choose an option: ", (input) => {
    switch (input) {
      case "1":
        showGroceryList();
        groceryShopping();
        break;

      case "2":
        console.log(" \nEnter Item name followed by quantity and price");
        console.log("  (Enter Q, quit or menu at any time to go back to menu)");

        let newItem = {
          name: "",
          quantity: "",
          price: "",
          bought: false,
        };

        let i = 0;

        rl.setPrompt("Item name: ");
        rl.prompt();

        rl.on("line", function cleanUpHandler(line) {
          if (
            line.toLowerCase() === "q" ||
            line.toLowerCase() === "quit" ||
            line.toLowerCase() === "menu"
          ) {
            rl.removeListener("line", cleanUpHandler);
            groceryShopping();
            return;
          }

          if (i == 0) {
            newItem.name = line;
            rl.setPrompt("Quantity: ");
            rl.prompt();
            i++;
          } else if (i == 1) {
            newItem.quantity = line;
            rl.setPrompt("Price: ");
            rl.prompt();
            i++;
          } else {
            //Here we Add the price and then push it to the List and reset everything back to the start
            newItem.price = line;
            rl.setPrompt("Item name: ");

            groceryList.push(newItem);

            console.log("Item added:", newItem, "\n");
            console.log("New Item");
            rl.prompt();
            i = 0;
            newItem = {
              name: "",
              quantity: "",
              price: "",
              bought: false,
            };
          }
        });
        break;

      case "3":
        showGroceryList();
        console.log(" \nEnter the number of the items you want to remove");
        console.log("  (can enter multiple separated by spaces or commas)");
        console.log("  (Enter Q, quit or menu at any time to go back to menu)");

        rl.setPrompt("Item numbers to remove: ");
        rl.prompt();

        rl.on("line", function cleanUpHandler(line) {
          if (
            line.toLowerCase() === "q" ||
            line.toLowerCase() === "quit" ||
            line.toLowerCase() === "menu"
          ) {
            rl.removeListener("line", cleanUpHandler);
            groceryShopping();
            return;
          }

          //Split text and turn into Integer
          const itemIndexes = line.split(/[\s,]+/).map((n) => parseInt(n) - 1);

          //remove from list
          itemIndexes.forEach((i) => groceryList.splice(i, 1));
          console.log("Items removed from the list");

          //Start Again
          showGroceryList();
          rl.prompt();
        });

        break;

      case "4":
        console.log(
          " \nEnter the number of the items to mark as bought or change to not bought"
        );
        console.log("  (can enter multiple separated by spaces or commas)");
        console.log("  (Enter Q, quit or menu at any time to go back to menu)");

        showGroceryList();

        rl.setPrompt("Item numbers to mark as bought: ");
        rl.prompt();

        rl.on("line", function cleanUpHandler(line) {
          if (
            line.toLowerCase() === "q" ||
            line.toLowerCase() === "quit" ||
            line.toLowerCase() === "menu"
          ) {
            rl.removeListener("line", cleanUpHandler);
            groceryShopping();
            return;
          }

          //Split text and turn into Integer
          const itemIndexes = line.split(/[\s,]+/).map((n) => parseInt(n) - 1);

          //remove from list
          itemIndexes.forEach(
            (i) => (groceryList[i].bought = !groceryList[i].bought)
          );

          //Start Again
          showGroceryList();
          rl.prompt();
        });

        break;
    }
  });
}

groceryShopping();
