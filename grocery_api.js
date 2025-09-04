const http = require("http");
const fs = require("fs");
const { logger } = require("./logger");

// reading data from a json file
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const PORT = 3000;

const server = http.createServer((req, res) => {
  let body = "";

  logger.info("Incoming request", { method: req.method, url: req.url });

  req
    .on("data", (chunk) => {
      body += chunk;
    })
    .on("end", () => {
      body = body.length > 0 ? JSON.parse(body) : {};
      const contentType = { "Content-Type": "application/json" };

      if (req.url.startsWith("/list")) {
        let index = parseInt(req.url.split("/")[2]);

        switch (req.method) {
          case "GET":
            res.writeHead(200, contentType);
            res.end(JSON.stringify(data.grocery_list));

            break;

          case "POST":
            const { name, quantity, price } = body;

            if (!name || !price || !price) {
              logger.info("POST validation failed", { body });
              res.writeHead(400, contentType);
              res.end(
                JSON.stringify({
                  message: "Please provide a valid name,quantity and price",
                })
              );
            } else {
              let newItem = {
                name,
                quantity,
                price,
                purchased: false,
              };

              data.grocery_list.push(newItem);

              fs.writeFile("data.json", JSON.stringify(data), "utf8", (err) => {
                if (err) {
                  logger.info("Failed to write data.json", {
                    error: err.message,
                  });
                  console.error(err);
                  return;
                }
                console.log("data Posted");
              });

              logger.info("Item created", { newItem });
              res.writeHead(201, contentType);
              res.end(
                JSON.stringify({
                  message: "Item added to list",
                  name,
                  quantity,
                  price,
                })
              );
            }
            break;

          case "PUT":
            if (!index) {
              logger.info(`Failed to find ID ${index}`);
              res.writeHead(400, contentType);
              res.end(
                JSON.stringify({
                  message: "Please provide a valid item ID to update",
                })
              );
            } else {
              const currentItem = data.grocery_list[index];

              if (!currentItem) {
                res.writeHead(404, contentType);
                res.end(JSON.stringify({ message: `Item ${index} not found` }));
              } else {
                const { name, quantity, price, purchased } = body;

                currentItem.name = name;
                currentItem.quantity = quantity;
                currentItem.price = price;
                currentItem.purchased = purchased;

                fs.writeFile(
                  "data.json",
                  JSON.stringify(data),
                  "utf8",
                  (err) => {
                    if (err) {
                      logger.info("Failed to write data.json", {
                        error: err.message,
                      });
                      console.error(err);
                      return;
                    }
                    console.log(`Item ${index} Updated`);
                  }
                );

                logger.info("Item updated", { index, item });
                res.writeHead(201, contentType);
                res.end(
                  JSON.stringify({
                    message: `Item ${index} Updated`,
                    currentItem,
                  })
                );
              }
            }
            break;

          case "DELETE":
            if (!index) {
              res.writeHead(400, contentType);
              res.end(
                JSON.stringify({
                  message: "Please provide a valid item ID to delete",
                })
              );
            } else {
              data.grocery_list.splice(index, 1);

              fs.writeFile("data.json", JSON.stringify(data), "utf8", (err) => {
                if (err) {
                  logger.info("Failed to write data.json", {
                    error: err.message,
                  });
                  console.error(err);
                  return;
                }
                console.log(`Item ${index} Delete`);
              });

              logger.info("Item deleted", { index });
              res.writeHead(200, contentType);
              res.end(
                JSON.stringify({
                  message: `Item ${index} deleted`,
                })
              );
            }
            break;

          default:
            res.statusCode = 405; // method not allowed
            res.end(JSON.stringify({ message: "Method not supported" }));
            break;
        }
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
        logger.info("Route not Found");
      }
    });
});

server.listen(PORT, () => {
  logger.info(`server is listening on http://localhost:${PORT}`);
  console.log(`server is listening on http://localhost:${PORT}`);
});
