/* Initial Setup and Housekeeping */
const fs = require("fs");
const file = require("./combo-pizza-Dev.json");
let tempDB;
let numEdited = 0;

/* Function to add an associate to the database */
function addAssociate(vrcName, regTime, isDev = false, isCBAdmin = false, departments) {
    
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
            itd: 0
        }
    file.Associates.forEach((value, index) => {
        value.Departments.forEach((v, i) => {
            
        })
    });
    console.log(`Fetched ${file.Associates.length} associates!\n`);
    console.log(`Breakdown: \n\n
        Customer Service --- ${temp.cust}\n
        Electronics -------- ${temp.elec}\n
        `);

}

function writeFile(F, D) {
    fs.writeFileSync(F, D);
}



fs.writeFileSync(file, )
