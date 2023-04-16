import { searchAndUpdateSheetForEachAddress } from "./lib";
import { contractData } from "./types";
import { Request, Response} from "express";
var express = require("express");
var app = express();
const fs = require('fs');

var fileData = fs.readFileSync('./src/contracts.json');
var contractDataJson: contractData[] = JSON.parse(fileData);




app.get(`/update`, async function (req: Request , res: Response) {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  //run search and update
  searchAndUpdateSheetForEachAddress(contractDataJson);

  res.send({
    message: "task done",
  });
});

module.exports = app;
app.listen(9000, () => console.log("App listening on port 9000!"));
