/* Initial Setup and Housekeeping */
const fs = require("fs");
const file = require("./combo-pizza-Dev.json");
const fileLegacy = require("./combo-pizza.json");
let tempDB, tempDBLegacy;
let numEdited = 0;

logInfo();

/* Thanks to null. 
 * you know who you are :3 */


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
    if (!vrcName || !priDept) {
        return console.log(`\nFailed to add associate!\n\nPlease set a ${!vrcName ? "username" : "primary department"}!\n`);
    }

    const associate = {
        VRC_Username: vrcName,
        RegistryTimeStamp: regTime,
        Dev: isDev,
        FunnyCallboxes: isCBAdmin,
        Departments: [{ Name: priDept }]
    };

    const legacyAssociate = {
        VRC_Username: vrcName,
        ShiftCount: 69420,
        RegistryTimeStamp: regTime,
        departments: [{ Name: priDept, ID: 0 }]
    };

    const dbPath = "./combo-pizza-Dev.json";
    const legacyPath = "./combo-pizza.json";

    file.Associates.push(associate);
    fs.writeFileSync(dbPath, JSON.stringify(file));
    console.log(`\nAdded ${vrcName} to the database!\n
        Initial Department --- ${priDept}
        RegistryTimeStamp ---- ${regTime}
        Dev ------------------ ${isDev}
        FunnyCallboxes ------- ${isCBAdmin}`);

    fileLegacy.Clocked_In_Associates.push(legacyAssociate);
    fs.writeFileSync(legacyPath, JSON.stringify(fileLegacy));
    console.log(`\nAdded ${vrcName} to legacy database!\n`);
}

function addDepartment(vrcName, departmentName) {
    if (!vrcName || !departmentName) {
        return console.log(`\nFailed to edit associate!\n\nPlease set a ${!vrcName ? "username" : "primary department"}!\n`);
    }

    const associateIndex = file.Associates.findIndex(a => a.VRC_Username === vrcName);
    const legacyIndex = fileLegacy.Clocked_In_Associates.findIndex(a => a.VRC_Username === vrcName);

    if (associateIndex === -1 || legacyIndex === -1) {
        return console.log(`\nFailed to edit associate!\n\nUser "${vrcName}" not found in one or both databases.\n`);
    }

    file.Associates[associateIndex].Departments.push({ Name: departmentName });
    fileLegacy.Clocked_In_Associates[legacyIndex].departments.push({ Name: departmentName, ID: 0 });

    fs.writeFileSync("./combo-pizza-Dev.json", JSON.stringify(file));
    fs.writeFileSync("./combo-pizza.json", JSON.stringify(fileLegacy));

    console.log(`\nModified ${vrcName} in the database!\n
    New Department ------- ${departmentName}`);
}

function removeDepartment(vrcName, departmentName) {
    if (!vrcName || !departmentName) {
        return console.log(`\nFailed to edit associate!\n\nPlease set a ${!vrcName ? "username" : "department to remove"}!\n`);
    }

    const associateIndex = file.Associates.findIndex(a => a.VRC_Username === vrcName);
    const legacyIndex = fileLegacy.Clocked_In_Associates.findIndex(a => a.VRC_Username === vrcName);

    if (associateIndex === -1 || legacyIndex === -1) {
        return console.log(`\nFailed to edit associate!\n\nUser "${vrcName}" not found in one or both databases.\n`);
    }

    const departments = file.Associates[associateIndex].Departments;
    const legacyDepartments = fileLegacy.Clocked_In_Associates[legacyIndex].departments;

    file.Associates[associateIndex].Departments = departments.filter(d => d.Name !== departmentName);
    fileLegacy.Clocked_In_Associates[legacyIndex].departments = legacyDepartments.filter(d => d.Name !== departmentName);

    fs.writeFileSync("./combo-pizza-Dev.json", JSON.stringify(file));
    fs.writeFileSync("./combo-pizza.json", JSON.stringify(fileLegacy));

    console.log(`\nRemoved "${departmentName}" from ${vrcName}'s departments.\n`);
}


function logInfo() {
  const aliasMap = {
    "customer service": "Customer Service",
    "customer service manager": "Customer Service",
    "assistant customer service manager": "Customer Service",

    "electronics": "Electronics",
    "electronics manager": "Electronics",
    "assistant electronics manager": "Electronics",

    "hardlines": "Hardlines",
    "hardlines manager": "Hardlines",
    "assistant hardlines manager": "Hardlines",

    "kcafe": "KCafe",
    "kcafe manager": "KCafe",
    "assistant kcafe manager": "KCafe",

    "pharmacy": "Pharmacy",
    "harmacy": "Pharmacy",
    "pharmacy manager": "Pharmacy",
    "assistant pharmacy manager": "Pharmacy",

    "janitorial": "Janitorial",
    "janitorial manager": "Janitorial",
    "assistant janitorial manager": "Janitorial",

    "sporting goods": "Sporting Goods",
    "sporting goods manager": "Sporting Goods",
    "assistant sporting goods manager": "Sporting Goods",

    "bakery/deli": "Bakery/Deli",
    "bakery/deli manager": "Bakery/Deli",
    "assistant bakery/deli manager": "Bakery/Deli",

    "claims": "Claims",
    "claims manager": "Claims",
    "assistant claims manager": "Claims",

    "automotive": "Automotive",
    "automotive manager": "Automotive",
    "assistant automotive manager": "Automotive",

    "layaway": "Layaway",
    "layaway manager": "Layaway",
    "assistant layaway manager": "Layaway",

    "photo center": "Photo Center",
    "photo center manager": "Photo Center",
    "assistant photo center manager": "Photo Center",

    "garden": "Garden",
    "garden manager": "Garden",
    "assistant garden manager": "Garden",

    "security": "Security",
    "developer": "Developer",
    "marketing": "Marketing",
    "management": "Management",
    "human resources": "Human Resources",
    "it department": "IT Department",
    "trainer": "Trainer",
    "lead trainer": "Trainer"
  };

  const counters = {};

  file.Associates.forEach(({ Departments }) => {
    Departments.forEach(({ Name }) => {
      const deptName = Name.toLowerCase();
      const category = aliasMap[deptName];
      if (category) {
        counters[category] = (counters[category] || 0) + 1;
      }
    });
  });

  console.log(`Fetched ${file.Associates.length} associates!\n`);
  console.log("Breakdown:\n");

  Object.keys(counters).sort().forEach(key => {
    console.log(`${key.padEnd(20, ' ')} --- ${counters[key]}`);
  });
}


function writeFile(F, D) {
  fs.writeFileSync(F, D);
}
