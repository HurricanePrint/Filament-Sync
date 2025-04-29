const {createProfile, updateProfiles, readDatabase} = require('./tools/database-tool.js')
const {addFilament} = require('./tools/options-tool.js')
const {initData, loadCustomProfiles, sendToPrinter} = require('./tools/config.js')
const {convertToPrinterFormat} = require('./tools/jsonhandler.js')

initData()

const addOptions = () => {
    let customProfiles = loadCustomProfiles()
    for (item in customProfiles) {
        let curItem = customProfiles[item]
        if (curItem.filament_notes != undefined && curItem.filament_notes.length != 0) {
            let curItemData = JSON.parse(curItem.filament_notes)
            addFilament(curItemData.vendor, curItemData.type, curItemData.name)
        } else {
            console.error('\nFilament notes are missing')
            console.error('https://github.com/HurricanePrint/Filament-Sync#creating-custom-filament-presets')
            process.exit()
        }
    }
}

const addProfiles = () => {
    let profiles = readDatabase().result.list
    let presets = loadCustomProfiles()

    for (item in presets) {
        let foundMatch = false
        let curItem = presets[item]
        let updatedFilamentEntry = convertToPrinterFormat(curItem)

        for (profileItem in profiles) {
            let curProfileItem = profiles[profileItem]
            if (updatedFilamentEntry.base.id == curProfileItem.base.id) {
                foundMatch = true
                updateProfiles(updatedFilamentEntry)
            } else if (profileItem == profiles.length - 1 && foundMatch == false) {
                createProfile(updatedFilamentEntry)
            }
        }
    }
}

addOptions()

addProfiles()

sendToPrinter()