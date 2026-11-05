import page from "./page.html" with { type: "text" };
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const dir = path.dirname(process.argv[1]);
http.createServer((req, res) => {
  if (req.url === "/") return res.end(page);
  const file = path.join(dir, req.url);
  if (!file.startsWith(dir) || !fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader("content-type", file.endsWith(".js") ? "text/javascript" : file.endsWith(".css") ? "text/css" : "text/plain");
  fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 4580);
