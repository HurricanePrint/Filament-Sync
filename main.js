const addOptions = require('./tools/options-tool.js')
const addProfiles = require ('./tools/database-tool.js')
const {initData, sendToPrinter} = require('./tools/config.js')

initData()

// addOptions()

addProfiles()

sendToPrinter()