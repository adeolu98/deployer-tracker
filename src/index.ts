var express = require("express");
var app = express();

const { ethers } = require("ethers");
const contractCreationHexIdentifier = "0x608060";
//const { contractsData } = require("./contracts.ts");
const fetch = require("node-fetch");

const networkNames = {
  homestead: 1,
  goerli: 5,
  matic: 137,
  arbitrum: 42161,
  optimism: 10,
  sepolia: 11155111,
};

const contractsData = [
  {
    network: "homestead",
    addresses: {
      sushiswap: ["0x80805ae3cbE23715C1f1807A03C5fb669541C2A9"],
      badger: ["0x80805ae3cbE23715C1f1807A03C5fb669541C2A9"],
    },
  },
  {
    network: "sepolia",
    addresses: {
      sushiswap: ["0x80805ae3cbE23715C1f1807A03C5fb669541C2A9"],
      badger: ["0x80805ae3cbE23715C1f1807A03C5fb669541C2A9"],
    },
  },
];

async function search(deployerAddress, network) {
  const etherscanProvider = new ethers.providers.EtherscanProvider(network);
  const history = await etherscanProvider.getHistory(deployerAddress);

  // search through past tx data for contractCreationHexIdentifier in data field.

  const filtered = history.filter((tx) => {
    tx.data.includes(contractCreationHexIdentifier); // &&(Date.now()/1000) - tx.timestamp <= 43200; // check if the deploy happened in last 12 hrs
  });
  console.log("filtered", filtered);

  return filtered;
}

async function callSheety() {
  let url =
    "https://api.sheety.co/555630a0193000542b1d8d8703523324/liveTimeNewContractMonitor/sheet1";
  let body = {
    sheet1: {
      protocol: "sushiswap",
      extraLabel: "",
      "date(WithTime)": 10,
      chainID: "null",
      address: "0x123",
    },
  };
  try {
    console.log("trying call");

    const sheetyRes = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Authorization": "Bearer a test token for now",
      },
    });

    const sheetyJson = await sheetyRes.json();
    console.log('sheetyJson',sheetyJson );
    
  } catch (error) {
    console.log("error", error);
  }
}
callSheety()

// get data and filter it, return only txs with 0x608060 in input data
// app.get(`/run`, async function (req, res) {
//   // res.setHeader("Content-Type", "text/html");
//   // res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
//   // const headers = new Headers();
//   // contractsData.map((data) => {
//   //   const network = data.network;
//   //   //check each address for total new contract deploys
//   //   //do for sushi
//   //   console.log('do for sushi');
//   //   console.log(data.addresses);
//   //   data.addresses.sushiswap.map(async (data) => {
//   //     console.log(data);
//   //     const filteredTxData = await search(data, network);
//   //     console.log('filteredTxData', filteredTxData);
//   //     const newSheetBody = filteredTxData.map((data) => {
//   //       return {
//   //         Protocol: "sushiswap",
//   //         "Extra Label": "",
//   //         "Date (with time)": data.timestamp,
//   //         ChainID: networkNames[network],
//   //         Address: data.creates,
//   //       };
//   //     });
//   //     console.log('filtering done');
//   //     console.log('newSheetBody', newSheetBody);
//   //     newSheetBody.map(async (data) => {
//   //       console.log('posting to google doc');
//   //       const headers = new Headers();
//   //       headers.append("Authorization", "Bearer a test token for now");
//   //       let url =
//   //         "https://api.sheety.co/555630a0193000542b1d8d8703523324/liveTimeNewContractMonitor/sheet1";
//   //       let body = {
//   //         sheet1: data,
//   //       };
//   //       const sheetyRes = await fetch(url, {
//   //         method: "POST",
//   //         body: JSON.stringify(body),
//   //         headers: headers,
//   //       });
//   //       const sheetyJson = await sheetyRes.json();
//   //     });
//   //   });
//   // });
//   // res.send({
//   //   contractsCreated: txdata.map((data) => {
//   //     return data.creates;
//   //   }),
//   //   inputData: txdata.map((data) => {
//   //     return data.data;
//   //   }),
//   //   timestamp: txdata.map((data) => {
//   //     return data.timestamp;
//   //   }),
//   // });
// });

// module.exports = app;
// app.listen(9000, () => console.log("App listening on port 9000!"));
