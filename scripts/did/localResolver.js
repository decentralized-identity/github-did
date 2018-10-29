var http = require("http");
var path = require("path");
var fs = require("fs");

http
  .createServer(function(req, resp) {
    if (req.url === "/favicon.ico") {
      resp.writeHead(200, { "Content-type": "text/plan" });
      resp.write("Hello Node JS Server Response");
      resp.end();
    }

    if (req.url.indexOf("/1.0/identifiers/") === 0) {
      const did = req.url.split("/1.0/identifiers/")[1];

      const docPath = path.resolve(
        process.cwd(),
        `./dids/${did}/didDocument.json`
      );

      resp.writeHead(200, { "Content-type": "application/json" });
      resp.write(fs.readFileSync(docPath));
      resp.end();
    }
  })

  .listen(7000);
