let clr = "\x1b[";

/* We don't have namespaces in js so this is the best we got */
const Utils = {
    info(name, msg) {
        console.log(`${clr}39;49m ${clr}96m[${name}]${clr}97m ${msg}${clr}39;49m`);
    },
    log(name, msg) {
        console.log(`${clr}39;49m \n${clr}96m[${name}]${clr}97m ${msg}${clr}39;49m`);
    },
    warn(name, msg) {
        console.warn(`${clr}39;49m \n${clr}103m[***WARNING*** - ${name}] ${msg}${clr}39;49m`);
    },
    error(name, msg) {
        console.error(`${clr}39;49m \n${clr}41m[***ERROR*** - ${name}] ${msg}${clr}39;49m`);
    },
    fatal(name, msg) {
        console.error(`${clr}39;49m \n\n${clr}41m[***FATAL ERROR*** - ${name}] ${msg}${clr}39;49m\n`);
        console.error(`${clr}39;49m${clr}41mExiting!${clr}39;49m`);
        process.exit(-1);
    }
}

module.exports = {
    Utils: Utils
}