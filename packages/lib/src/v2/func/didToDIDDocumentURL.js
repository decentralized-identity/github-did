const didToDIDDocumentURL = did => {
  const [_, method, identifier] = did.split(":");
  if (_ !== "did") {
    throw new Error("Invalid DID");
  }
  if (method !== "github") {
    throw new Error("Invalid DID, should look like did:github:USERNAME");
  }

  if (method === "github") {
    const base = "https://raw.githubusercontent.com/";
    const url = `${base}${identifier}/ghdid/master/index.jsonld`;
    return url;
  }
};

module.exports = didToDIDDocumentURL;
