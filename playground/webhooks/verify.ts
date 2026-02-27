import { createServer } from "node:http";
import { Webhooks } from "../../src/modules/webhooks";

const server = createServer(async (req, res) => {
  if (req.url === "/webhooks" && req.method === "POST") {
    const rawBody = await new Promise<string>((resolve) => {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => resolve(body));
    });

    const isValid = await Webhooks.verify({
      payload: rawBody,
      headers: req.headers as Record<string, string>
    });

    res.writeHead(isValid ? 200 : 400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ isValid }));
  }
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(3000, () => {
  console.info("Server is listening on http://localhost:3000/webhooks");
});
