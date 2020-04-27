const fetch = require("node-fetch");

const getJson = async url => {
  // TODO: remove await
  const data = await (await fetch(url, {
    method: "get",
    headers: {
      Accept: "application/ld+json"
    }
  })).json();
  return data;
};

module.exports = getJson;
