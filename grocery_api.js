const http = require("http");
const { logger } = require("./logger");
const { getItems, addItem, updateItem, deleteItem } = require("./grocery_handlers");

const PORT = 3000;

const server = http.createServer((req, res) => {
  let body = "";

  req.on("data", chunk => { body += chunk; });
  req.on("end", () => {
    body = body.length > 0 ? JSON.parse(body) : {};
    const contentType = { "Content-Type": "application/json" };

    if (req.url.startsWith("/list")) {
      let index = parseInt(req.url.split("/")[2]);

      let response;
      switch (req.method) {
        case "GET":
          response = { status: 200, body: getItems() };
          break;
        case "POST":
          response = addItem(body);
          break;
        case "PUT":
          response = updateItem(index, body);
          break;
        case "DELETE":
          response = deleteItem(index);
          break;
        default:
          response = { status: 405, body: { message: "Method not supported" } };
      }

      res.writeHead(response.status, contentType);
      res.end(JSON.stringify(response.body));
    } else {
      res.writeHead(404, contentType);
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  });
});

server.listen(PORT, () => {
  logger.info(`server is listening on http://localhost:${PORT}`);
});