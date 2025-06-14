/* Initial Setup and Housekeeping */
const assert = require("node:assert");
const fs = require("fs");
const CSV = require("csv");
const file = require("./combo-pizza-Dev.json");
const fileLegacy = require("./combo-pizza.json");

phase1();
function phase1() {
  // console.log("\n\n\n\V3 DATABASE\n\n\n\n");
  // const content = fs.readFileSync(`./associates.csv`);
  // const records = CSV.parse(content, { columns: true }, (err, rec) => {
  //   rec.forEach((element) => {
  //     console.log(element.Name);
  //   });
  // });

  // console.log("\n\n\n\nV2 DATABASE\n\n\n\n");

  // file.Associates.forEach((elem) => {
  //   console.log(elem.VRC_Username);
  // });


  console.log("\n\n\n\nV1 DATABASE\n\n\n\n");

  fileLegacy.Clocked_In_Associates.forEach((elem) => {
    console.log(elem.VRC_Username);
  });
}