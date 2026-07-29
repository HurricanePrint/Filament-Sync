const addOptions = require('./tools/options-tool.js')
const addProfiles = require ('./tools/database-tool.js')
const {initData} = require('./tools/config.js')
const {checkIds} = require('./tools/id-check.js')
const sendToPrinter = require('./tools/scp.js')
const installService = require('./tools/service-installer.js')
const autoUpdate = require('./tools/update.js')

const main = async () => {
    try {
        await autoUpdate()
        await installService()
        initData()
        if (!await checkIds()) return
        addOptions()
        addProfiles()
        sendToPrinter()
    } catch (err) {
        console.error(err)
    }

}

main()