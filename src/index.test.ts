const apiApp = require("./index.ts");
const request = require("supertest");

const deployerAddress = "0x80805ae3cbE23715C1f1807A03C5fb669541C2A9";
const network = "sepolia";

describe("fetch data for a given deployer address on sepolia", () => {
  it("updates new deployments data of contract Addresses", async () => {
    const res = await request(apiApp).get(`/update`);
    
    expect(res.status).toBe(200)
    expect(res.text.includes('task done')).toBeTruthy;
  });
});
