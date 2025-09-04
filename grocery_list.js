// Import the readline module for handling user input in the console
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout, // Write to standard output (console)
});

rl.once("close", () => {
  // end of input
  console.log("\nGoodbye");
});

const groceryList = [];

// if (process.env.DEBUG_MODE === "true") {
//   groceryList.push({
//     name: "pizza",
//     quantity: 3,
//     price: 2,
//     bought: false,
//   });

//   groceryList.push({
//     name: "Potato",
//     quantity: 3,
//     price: 2,
//     bought: false,
//   });

//   groceryList.push({
//     name: "Apple",
//     quantity: 3,
//     price: 2,
//     bought: false,
//   });
// }

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

export function groceryShopping(clear = true) {
  if (clear === true) {
    console.clear();
  }
  console.log("\n------------ Menu ------------");
  console.log("1. Display grocery list");
  console.log("2. Add Items to grocery list");
  console.log("3. Remove items from the grocery list");
  console.log("4. Mark bought items");

  rl.question("Choose an option: ", (input) => {
    switch (input) {
      case "1":
        console.clear();
        showGroceryList();
        groceryShopping(false);
        break;

      case "2":
        console.clear();
        console.log(" \nEnter Item name followed by quantity and price");
        console.log("  (Enter Q, quit or menu at any time to go back to menu)");

        let newItem = {
          name: "",
          quantity: 0,
          price: 0,
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
            newItem.quantity = parseInt(line, 10);
            rl.setPrompt("Price: ");
            rl.prompt();
            i++;
          } else {
            //Here we Add the price and then push it to the List and reset everything back to the start
            newItem.price = parseInt(line, 10);
            rl.setPrompt("Item name: ");

            groceryList.push(newItem);

            console.log("Item added:", newItem, "\n");
            console.log("New Item");
            rl.prompt();
            i = 0;
            newItem = {
              name: "",
              quantity: 0,
              price: 0,
              bought: false,
            };
          }
        });
        break;

      case "3":
        console.clear();
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
          const itemIndexes = line
            .split(/[\s,]+/)
            .map((n) => parseInt(n, 10) - 1);

          //remove from list
          itemIndexes.forEach((i) => groceryList.splice(i, 1));
          console.log("Items removed from the list");

          //Start Again
          showGroceryList();
          rl.prompt();
        });

        break;

      case "4":
        console.clear();
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
          const itemIndexes = line
            .split(/[\s,]+/)
            .map((n) => parseInt(n, 10) - 1);

          //remove from list
          itemIndexes.forEach(
            (i) => (groceryList[i].bought = !groceryList[i].bought)
          );

          //Start Again

          console.clear();
          console.log(
            " \nEnter the number of the items to mark as bought or change to not bought"
          );
          console.log("  (can enter multiple separated by spaces or commas)");
          console.log(
            "  (Enter Q, quit or menu at any time to go back to menu)"
          );
          showGroceryList();
          rl.prompt();
        });

        break;
    }
  });
}