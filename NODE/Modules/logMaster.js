const log4js = require("log4js");
const dotenv = require('dotenv').config({ path: './class/log4jsProperties.env' })


log4js.configure({
    appenders: { Elektron_BL: { type: "file", filename: process.env.LOG_PATH + "Elektron_BL.log" } },
    categories: { default: { appenders: ["Elektron_BL"], level: "debug" } }
});

const logger = log4js.getLogger("Elektron_BL");

//exporting module
module.exports = logger
