var express = require("express");
var app = express();

const { ethers } = require("ethers");
const fetch = require("node-fetch");

const contractCreationHexIdentifier = "0x608060";
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

  // search through past tx data for contractCreationHexIdentifier in data field and if the deploy happened in last 12 hrs
  const filtered = history.filter((tx) => {
    if (
      tx.data.includes(contractCreationHexIdentifier) &&
      Date.now() / 1000 - tx.timestamp <= 43200
    )
      return tx;
  });
  return filtered;
}

async function callSheety(data) {
  let url =
    "https://api.sheety.co/555630a0193000542b1d8d8703523324/liveTimeNewContractMonitor/sheet1";
  let body = {
    sheet1: data,
  };
  try {
    const sheetyRes = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YSB0ZXN0IHRva2VuIGZvciBub3c",
      },
    });
    const sheetyJson = await sheetyRes.json();
  } catch (error) {
    console.log("error", error);
  }
}

async function searchAndUpdateSheetForEachAddress() {
  contractsData.map((data) => {
    const network = data.network;
    //check each address for total new contract deploys

    const addressData = Object.entries(data.addresses);

    addressData.map((data) => {
      const protocolName = data[0];
      
      data[1].map(async (data) => {
        const filteredTxData = await search(data, network);
        const newSheetBody = filteredTxData.map((data) => {
          return {
            protocol: protocolName,
            extraLabel: "",
            "date (withTime)": getTime(data.timestamp),
            chainId: networkNames[network].toString(),
            address: data.creates,
          };
        });

        newSheetBody.map(async (data) => {
          callSheety(data);
        });
      });
    });
  });
}

function getTime(timestamp) {
  const date = new Date(timestamp * 1000);

  //format is h:m dd/mm/yy
  const minutes = "0" + date.getMinutes();
  const hours = "0" + date.getHours();
  return `${hours.substr(-2)}:${minutes.substr(-2)} ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear().toString().slice(2)}`;
}

app.get(`/update`, async function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  //run search and update
  searchAndUpdateSheetForEachAddress();

  res.send({
    message: "task done",
  });
});

module.exports = app;
app.listen(9000, () => console.log("App listening on port 9000!"));
