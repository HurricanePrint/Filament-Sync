const addOptions = require('./tools/options-tool.js')
const addProfiles = require ('./tools/database-tool.js')
const {initData} = require('./tools/config.js')
const sendToPrinter = require('./tools/scp.js')

initData()

addOptions()

addProfiles()

sendToPrinter()