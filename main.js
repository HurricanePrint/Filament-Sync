const addOptions = require('./tools/options-tool.js')
const addProfiles = require ('./tools/database-tool.js')
const {initData} = require('./tools/config.js')
const sendToPrinter = require('./tools/scp.js')
const installService = require('./tools/service-installer.js')

const main = async () => {
    try {
        await installService()
        initData()
        addOptions()
        addProfiles()
        sendToPrinter()
    } catch (err) {
        console.error(err)
    }

}

main()