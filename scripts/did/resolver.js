var http = require("http");

const request = require("request");

const { didMethod } = require("../../src/utils");

const repo = didMethod.replace(/github.com/g, "").replace(/:/g, "/");

http
  .createServer(function(req, resp) {
    if (req.url === "/favicon.ico") {
      res.writeHead(200, { "Content-type": "text/plan" });
      res.write("Hello Node JS Server Response");
      res.end();
    }

    if (req.url.indexOf("/1.0/identifiers/") === 0) {
      const did = req.url.split("/1.0/identifiers/")[1];
      const urlEncondedDID = encodeURIComponent(did);
      let docUrl = `https://raw.githubusercontent.com${repo}/master/dids/${urlEncondedDID}/didDocument.json`;
      // should check sig here...
      request.get(docUrl).pipe(resp);
    }
  })

  .listen(7000);
