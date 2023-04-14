var express = require("express");
var app = express();

const { ethers } = require("ethers");
const contractCreationHexIdentifier = "0x608060";

async function search(deployerAddress, network ) {
  const etherscanProvider = new ethers.providers.EtherscanProvider(network);
  const history = await etherscanProvider.getHistory(deployerAddress);

  // search through past tx data for contractCreationHexIdentifier in data field.
  const filtered = history.filter((tx) =>
    tx.data.includes(contractCreationHexIdentifier)
  );
  return filtered;
}

// get data and filter it, return only txs with 0x608060 in input data
app.get(`/:deployerAddr/:network`, async function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  const txdata = await search(req.params.deployerAddr, req.params.network);

  res.send({
    contractsCreated: txdata.map((data) => {
      return data.creates;
    }),
    inputData: txdata.map((data) => {
      return data.data;
    }),
    timestamp: txdata.map((data) => {
      return data.timestamp;
    }),
  });
});

module.exports = app;
//app.listen(9000, () => console.log("App listening on port 9000!"));
