const {createProfile, deleteProfile, readProfile, updateProfiles, convertToPrinterFormat} = require('./database-tool.js')
const {addFilament, removeFilament, removeType, removeVendor} = require('./options-tool.js')
const {readDatabase, updateDatabase, readOptions, updateOptions, loadCustomProfiles, loadFilamentPresets, sendToPrinter} = require('./config.js')


let addOptions = () => {
    let customProfiles = loadCustomProfiles()
    for (item in customProfiles) {
        let curItem = customProfiles[item]
        if(curItem.filament_notes != undefined) {
            let curItemData = JSON.parse(curItem.filament_notes)
            addFilament(curItemData.vendor, curItemData.type, curItemData.name)
        }
    }
}

addOptions()


let addProfiles = () => {
    let profiles = readDatabase().result.list
    let presets = loadCustomProfiles()
    
    for (item in presets) {
        let foundMatch = false
        let curItem = presets[item]
        for (profileItem in profiles) {
            let curProfileItem = profiles[profileItem]
            let curItemInfo = JSON.parse(curItem.filament_notes)
            if (curItemInfo.name == curProfileItem.base.name && curItemInfo.vendor == curProfileItem.base.brand) {
                foundMatch = true
                let updatedFilamentEntry = convertToPrinterFormat(curItem)
                updateProfiles(updatedFilamentEntry)
                break
            } 
            else if(profileItem == profiles.length - 1 && foundMatch == false) {
                let newFilamentEntry = convertToPrinterFormat(curItem)
                createProfile(newFilamentEntry)
                break
            }
        }
    }
}

addProfiles()



