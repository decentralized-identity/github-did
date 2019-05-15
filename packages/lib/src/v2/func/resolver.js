const getJson = require("./getJson");
const didToDIDDocumentURL = require("./didToDIDDocumentURL");

const resolver = {
  resolve: did => {
    const cleanedDID = did.split('#').shift();
    const url = didToDIDDocumentURL(cleanedDID);
    return getJson(url).catch(e => {
      console.error("Could not resolve " + did);
      console.error(e);
    });
  }
};

module.exports = resolver;
