import * as http from "http";
import { render } from "./scripts/render";

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});
server.listen(port, hostname, () => {
  render(1280, 720, 16, 10);
  server.close();
});
