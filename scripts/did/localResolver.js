var http = require("http");
var path = require("path");
var fs = require("fs");

const { verifyDIDDocumentWasSignedByID } = require("../../src/utils");


http
  .createServer(async (req, resp) => {
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

      const docSigPath = path.resolve(
        process.cwd(),
        `./dids/${did}/didDocument.sig`
      );

      const success = await verifyDIDDocumentWasSignedByID(
        docPath,
        docSigPath
      );

      if (success){
        resp.writeHead(200, { "Content-type": "application/json" });
        resp.write(fs.readFileSync(docPath));
     
      } else {
        resp.writeHead(500, { "Content-type": "application/json" });
        resp.write(JSON.stringify({
          error: 500,
          message: 'The document is not signed correctly.'
        }));
      }
      resp.end();
    }
  })

  .listen(7000);
