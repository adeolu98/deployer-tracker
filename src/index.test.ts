import { contractCreationHexIdentifier } from "./api";

const app = require("./index");
const request = require("supertest");

const deployerAddress = "0x80805ae3cbE23715C1f1807A03C5fb669541C2A9";
const network = "sepolia";


describe("fetch data for a given deployer address on sepolia", () => {
  it("get contract data", async () => {
    const res = await request(app).get(`/${deployerAddress}/${network}`);
    
    expect(res.status).toBe(200)
    expect(res.text.includes(contractCreationHexIdentifier)).toBeDefined;
  });
});
