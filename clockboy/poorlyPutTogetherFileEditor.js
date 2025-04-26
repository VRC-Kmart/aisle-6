/* Initial Setup and Housekeeping */
const fs = require("fs");
const file = require("./combo-pizza-Dev.json");
const fileLegacy = require("./combo-pizza.json");
let tempDB, tempDBLegacy;
let numEdited = 0;

// logInfo();


/* How to add an associate using the tool! 
 *
 * ANYTHING NOT REQUIRED CAN BE REMOVED AND IT'LL BE SET TO DEFAULT
 * 
 * set USER_NAME to the VRChat username of the associate
 *     (required)
 * set DEPARTMENT to the name of the desired department
 *     (required)
 * 
 * set REGISTER_TIME to the desired Unix Timestamp including milliseconds
 *     (or leave blank and it'll autofill it with the current time)
 * set DEVELOPER to true or false, depending on if they can see the admin buttons
 *     (this gives them item reset perms)
 * set CALLBOXES to true or false, depending on if they can use the admin callboxes
 */
// addAssociate("USER_NAME", "DEPARTMENT", REGISTER_TIME, DEVELOPER, CALLBOXES);

/* Function to add an associate to the database */
function addAssociate(vrcName, priDept, regTime = Date.now(), isDev = false, isCBAdmin = false) {
    if (vrcName == undefined) return console.log("\nFailed to add associate!\n\nPlease set a username!\n");
    if (priDept == undefined) return console.log("\nFailed to add associate!\n\nPlease set a primary department!\n");
    tempDB = file;
    tempDBLegacy = fileLegacy;

    let tempInfo = {
        "VRC_Username": vrcName,
        "RegistryTimeStamp": regTime,
        "Dev": isDev,
        "FunnyCallboxes": isCBAdmin,
        "Departments": [
            {
                "Name": priDept
            }
        ]
    }

    let tempInfoLegacy = {
      "VRC_Username": vrcName,
      "ShiftCount": 69420,
      "RegistryTimeStamp": regTime,
      "departments": [
          {
              "Name": priDept,
              "ID": 0
          }
      ]
    }
    tempDB.Associates.push(tempInfo);
    fs.writeFileSync("./combo-pizza-Dev.json", JSON.stringify(tempDB));

    console.log(`\nAdded ${vrcName} to the database!\n
        Initial Department --- ${priDept}
        RegistryTimeStamp ---- ${regTime}
        Dev ------------------ ${isDev}
        FunnyCallboxes ------- ${isCBAdmin}`);
        
    tempDBLegacy.Clocked_In_Associates.push(tempInfoLegacy);
    fs.writeFileSync("./combo-pizza.json", JSON.stringify(tempDBLegacy));
    console.log(`\nAdded ${vrcName} to legacy database!\n`);

}

/* I AM AWARE THIS IS BAD CODE BUT I DO NOT CARE BECAUSE IT FUCKING WORKS */
function addDepartment(vrcName, departmentName) {
  if (vrcName == undefined) return console.log("\nFailed to edit associate!\n\nPlease set a username!\n");
  if (departmentName == undefined) return console.log("\nFailed to edit associate!\n\nPlease set a primary department!\n");

  tempDB = file;
  tempDBLegacy = fileLegacy;

  let i, iL;
  tempDB.Associates.filter((key, index) => {
    if (key["VRC_Username"] == vrcName) i = index;
  });

  tempDBLegacy.Clocked_In_Associates.filter((key, index) => {
    if (key["VRC_Username"] == vrcName) iL = index;
  });

  file.Associates[i].Departments.push({ "Name": departmentName });
  fileLegacy.Clocked_In_Associates[i].departments.push({ "Name": departmentName, "ID": 0 });

  fs.writeFileSync("./combo-pizza-Dev.json", JSON.stringify(file));
  fs.writeFileSync("./combo-pizza.json", JSON.stringify(fileLegacy));


  console.log(`\nModified ${vrcName} in the database!\n
    New Department ------- ${departmentName}`);

}

function removeDepartment(vrcName, departmentName) {
  /* WIP. This doesn't do anything yet (obviously) */
}



function logInfo() {
  let temp = {
    cust: 0,
    elec: 0,
    hard: 0,
    cafe: 0,
    phar: 0,
    jani: 0,
    spor: 0,
    bake: 0,
    clai: 0,
    auto: 0,
    laya: 0,
    phot: 0,
    gard: 0,
    secr: 0,
    dev: 0,
    mkt: 0,
    mng: 0,
    hre: 0,
    itd: 0,
    trainer: 0,
  };
  file.Associates.forEach((value, index) => {
    value.Departments.forEach((v, i) => {
      switch (v.Name.toLowerCase()) {
        case "customer service":
        case "customer service manager":
        case "assistant customer service manager":
          temp.cust++;
          break;
        case "electronics":
        case "electronics manager":
        case "assistant electronics manager":
          temp.elec++;
          break;
        case "hardlines":
        case "hardlines manager":
        case "assistant hardlines manager":
          temp.hard++;
          break;
        case "kcafe":
        case "kcafe manager":
        case "assistant kcafe manager":
          temp.cafe++;
          break;
        case "harmacy":
        case "pharmacy":
        case "pharmacy manager":
        case "assistant pharmacy manager":
          temp.phar++;
          break;
        case "janitorial":
        case "janitorial manager":
        case "assistant janitorial manager":
          temp.jani++;
          break;
        case "sporting goods":
        case "sporting goods manager":
        case "assistant sporting goods manager":
          temp.spor++;
          break;
        case "bakery/deli":
        case "bakery/deli manager":
        case "assistant bakery/deli manager":
          temp.bake++;
          break;
        case "claims":
        case "claims manager":
        case "assistant claims manager":
          temp.clai++;
          break;
        case "automotive":
        case "automotive manager":
        case "assistant automotive manager":
          temp.auto++;
          break;
        case "layaway":
        case "layaway manager":
        case "assistant layaway manager":
          temp.laya++;
          break;
        case "photo center":
        case "photo center manager":
        case "assistant photo center manager":
          temp.phot++;
          break;
        case "garden":
        case "garden manager":
        case "assistant garden manager":
          temp.gard++;
          break;
        case "security":
          temp.secr++;
          break;
        case "developer":
          temp.dev++;
          break;
        case "marketing":
          temp.mkt++;
          break;
        case "management":
          temp.mng++;
          break;
        case "human resources":
          temp.hre++;
          break;
        case "it department":
          temp.itd++;
          break;
        case "trainer":
        case "lead trainer":
          temp.trainer++;
          break;
      }
    });
  });
  console.log(`Fetched ${file.Associates.length} associates!\n`);
  console.log(`Breakdown: \n\n
        Customer Service --- ${temp.cust}\n
        Electronics -------- ${temp.elec}\n
        Hardlines ---------- ${temp.hard}\n
        KCafe -------------- ${temp.cafe}\n
        Pharmacy ----------- ${temp.phar}\n
        Janitorial --------- ${temp.jani}\n
        Sporting Goods ----- ${temp.spor}\n
        Bakery/Deli -------- ${temp.bake}\n
        Claims ------------- ${temp.clai}\n
        Automotive --------- ${temp.auto}\n
        Layaway ------------ ${temp.laya}\n
        Photo Center ------- ${temp.phot}\n
        Garden ------------- ${temp.gard}\n
        Security ----------- ${temp.secr}\n
        \n
        Developer ---------- ${temp.dev}\n
        Marketing ---------- ${temp.mkt}\n
        Management --------- ${temp.mng}\n
        Human Resources ---- ${temp.hre}\n
        IT Department ------ ${temp.itd}\n
        Trainer ------------ ${temp.trainer}`);
}

function writeFile(F, D) {
  fs.writeFileSync(F, D);
}
