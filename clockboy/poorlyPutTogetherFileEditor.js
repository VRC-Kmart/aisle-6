/* Initial Setup and Housekeeping */
const fs = require("fs");
const file = require("./combo-pizza-Dev.json");
const fileLegacy = require("./combo-pizza.json");
let tempDB, tempDBLegacy;
let numEdited = 0;
const { Utils } = require("./utils.js");

addAssociate("Sersarina punny", "Claims");
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
function addAssociate(
  vrcName,
  priDept,
  regTime = Date.now(),
  isDev = false,
  isCBAdmin = false
) {
  if (!vrcName || !priDept) {
    return Utils.fatal(
      `Associate Add`,
      `Failed to add associate! Please set a ${
        !vrcName ? "username" : "primary department"
      }!`
    );
  }

  const associate = {
    VRC_Username: vrcName,
    RegistryTimeStamp: regTime,
    Dev: isDev,
    FunnyCallboxes: isCBAdmin,
    Departments: [{ Name: priDept }],
  };

  const legacyAssociate = {
    VRC_Username: vrcName,
    ShiftCount: 69420,
    RegistryTimeStamp: regTime,
    departments: [{ Name: priDept, ID: 0 }],
  };

  const dbPath = "./combo-pizza-Dev.json";
  const legacyPath = "./combo-pizza.json";

  file.Associates.push(associate);
  fs.writeFileSync(dbPath, JSON.stringify(file));

  fileLegacy.Clocked_In_Associates.push(legacyAssociate);
  fs.writeFileSync(legacyPath, JSON.stringify(fileLegacy));
  Utils.log(
    `Associate Add`,
    `Added ${vrcName} to the database!\n
        Initial Department --- ${priDept}
        RegistryTimeStamp ---- ${regTime}
        Dev ------------------ ${isDev}
        FunnyCallboxes ------- ${isCBAdmin}`
  );
}

function addDepartment(vrcName, departmentName) {
  if (!vrcName || !departmentName) {
    return Utils.fatal(
      `Department Add`,
      `Failed to edit associate! Please set a ${
        !vrcName ? "username" : "primary department"
      }!`
    );
  }

  const associateIndex = file.Associates.findIndex(
    (a) => a.VRC_Username === vrcName
  );
  const legacyIndex = fileLegacy.Clocked_In_Associates.findIndex(
    (a) => a.VRC_Username === vrcName
  );

  if (associateIndex === -1 || legacyIndex === -1) {
    return Utils.error(
      `Department Add`,
      `Failed to edit associate! User "${vrcName}" not found in one or both databases.`
    );
  }

  file.Associates[associateIndex].Departments.push({ Name: departmentName });
  fileLegacy.Clocked_In_Associates[legacyIndex].departments.push({
    Name: departmentName,
    ID: 0,
  });

  fs.writeFileSync("./combo-pizza-Dev.json", JSON.stringify(file));
  fs.writeFileSync("./combo-pizza.json", JSON.stringify(fileLegacy));

  Utils.log(
    `Department Add`,
    `Modified ${vrcName} in the database!\n New Department ------- ${departmentName}`
  );
}

function removeDepartment(vrcName, departmentName) {
  if (!vrcName || !departmentName) {
    return Utils.fatal(
      `Department Remove`,
      `Failed to edit associate! Please set a ${
        !vrcName ? "username" : "department to remove"
      }!`
    );
  }

  const associateIndex = file.Associates.findIndex(
    (a) => a.VRC_Username === vrcName
  );
  const legacyIndex = fileLegacy.Clocked_In_Associates.findIndex(
    (a) => a.VRC_Username === vrcName
  );

  if (associateIndex === -1 || legacyIndex === -1) {
    return Utils.error(
      `Department Remove`,
      `Failed to edit associate! User "${vrcName}" not found in one or both databases.`
    );
  }

  const departments = file.Associates[associateIndex].Departments;
  const legacyDepartments =
    fileLegacy.Clocked_In_Associates[legacyIndex].departments;

  file.Associates[associateIndex].Departments = departments.filter(
    (d) => d.Name !== departmentName
  );
  fileLegacy.Clocked_In_Associates[legacyIndex].departments =
    legacyDepartments.filter((d) => d.Name !== departmentName);

  fs.writeFileSync("./combo-pizza-Dev.json", JSON.stringify(file));
  fs.writeFileSync("./combo-pizza.json", JSON.stringify(fileLegacy));

  Utils.log(
    `Department Remove`,
    `Removed "${departmentName}" from ${vrcName}'s departments.`
  );
}

function removeAssociate(vrcName) {
  if (!vrcName) {
    return Utils.fatal(
      `Associate Remove`,
      `Failed to remove associate! Please set a username to remove!`
    );
  }

  const associateIndex = file.Associates.findIndex(
    (a) => a.VRC_Username === vrcName
  );
  const legacyIndex = fileLegacy.Clocked_In_Associates.findIndex(
    (a) => a.VRC_Username === vrcName
  );

  if (associateIndex === -1 || legacyIndex === -1) {
    return Utils.error(
      `Associate Remove`,
      `Failed to remove associate! User "${vrcName}" not found in one or both databases.`
    );
  }

  file.Associates.splice(associateIndex, 1);
  fileLegacy.Clocked_In_Associates.splice(legacyIndex, 1);

  fs.writeFileSync("./combo-pizza-Dev.json", JSON.stringify(file));
  fs.writeFileSync("./combo-pizza.json", JSON.stringify(fileLegacy));

  Utils.log(`Associate Remove`, `Removed "${vrcName}" from the databases.`);
}

function logInfo() {
  const aliasMap = {
    "customer service": "Customer Service",
    "customer service manager": "Customer Service",
    "assistant customer service manager": "Customer Service",

    electronics: "Electronics",
    "electronics manager": "Electronics",
    "assistant electronics manager": "Electronics",

    hardlines: "Hardlines",
    "hardlines manager": "Hardlines",
    "assistant hardlines manager": "Hardlines",

    kcafe: "KCafe",
    "kcafe manager": "KCafe",
    "assistant kcafe manager": "KCafe",

    pharmacy: "Pharmacy",
    harmacy: "Pharmacy",
    "pharmacy manager": "Pharmacy",
    "assistant pharmacy manager": "Pharmacy",

    janitorial: "Janitorial",
    "janitorial manager": "Janitorial",
    "assistant janitorial manager": "Janitorial",

    "sporting goods": "Sporting Goods",
    "sporting goods manager": "Sporting Goods",
    "assistant sporting goods manager": "Sporting Goods",

    "bakery/deli": "Bakery/Deli",
    "bakery/deli manager": "Bakery/Deli",
    "assistant bakery/deli manager": "Bakery/Deli",

    claims: "Claims",
    "claims manager": "Claims",
    "assistant claims manager": "Claims",

    automotive: "Automotive",
    "automotive manager": "Automotive",
    "assistant automotive manager": "Automotive",

    layaway: "Layaway",
    "layaway manager": "Layaway",
    "assistant layaway manager": "Layaway",

    "photo center": "Photo Center",
    "photo center manager": "Photo Center",
    "assistant photo center manager": "Photo Center",

    garden: "Garden",
    "garden manager": "Garden",
    "assistant garden manager": "Garden",

    security: "Security",
    developer: "Developer",
    marketing: "Marketing",
    management: "Management",
    "human resources": "Human Resources",
    "it department": "IT Department",
    trainer: "Trainer",
    "lead trainer": "Trainer",
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

  Utils.log(
    `Associate Logger`,
    `Fetched ${file.Associates.length} associates!`
  );
  Utils.log(`Associate Logger`, "Breakdown:");

  Object.keys(counters)
    .sort()
    .forEach((key) => {
      Utils.info(
        `Associate Logger`,
        `${key.padEnd(20, " ")} --- ${counters[key]}`
      );
    });
}

function writeFile(F, D) {
  fs.writeFileSync(F, D);
}
