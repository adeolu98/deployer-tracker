import { contractData, sheetyBodyData } from "./types";

const { ethers } = require("ethers");
const fetch = require("node-fetch");


export const contractCreationHexIdentifier = "0x608060";
export const networkNames: Record<string, number> = {
  "homestead": 1,
  "goerli": 5,
  "matic": 137,
  "arbitrum": 42161,
  "optimism": 10,
  "sepolia": 11155111,
};


export async function search(deployerAddress: string, network: string) {
  const etherscanProvider = new ethers.providers.EtherscanProvider(network);
  const history = await etherscanProvider.getHistory(deployerAddress);

  // search through past tx data for contractCreationHexIdentifier in data field and if the deploy happened in last 12 hrs
  const filtered = history.filter((tx) => {
    if (
      tx.data.includes(contractCreationHexIdentifier) &&
      Date.now() / 1000 - tx.timestamp <= fromHoursToSeconds(12)
    )
      return tx;
  });
  return filtered;
}

export async function callSheety(data: sheetyBodyData) {
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

export async function searchAndUpdateSheetForEachAddress(contractDataJson :contractData[]) {
  contractDataJson.map((data) => {
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
            extraLabel: data.from.slice(0,8),
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

export function getTime(timestamp: number) {
  const date = new Date(timestamp * 1000);

  //format is h:m dd/mm/yy
  const minutes = "0" + date.getMinutes();
  const hours = "0" + date.getHours();
  return `${hours.substr(-2)}:${minutes.substr(-2)} ${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear().toString().slice(2)}`;
}

export function fromHoursToSeconds(hours: number) {
    const oneHourInSeconds = 3600;
    return hours * oneHourInSeconds;
}