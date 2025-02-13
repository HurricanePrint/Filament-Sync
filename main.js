const {createProfile, deleteProfile, readProfile, updateProfiles} = require('./database-tool.js')
const {addFilament, removeFilament, removeType, removeVendor} = require('./options-tool.js')
const {readDatabase, updateDatabase, readOptions, updateOptions, loadCustomProfiles, loadFilamentPresets, sendToPrinter} = require('./config.js')



// read and store options list
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


// let addProfiles = () => {
//     let profiles = readDatabase().result.list
//     let presets = loadCustomProfiles()
//     for (item in presets) {
//         let curItem = presets[item]
//         for (profileItem in profiles) {
//             let curProfileItem = profiles[profileItem]
            
//             // console.log(curProfileItem)
//             if (curItem.name == curProfileItem.base.name) {
//                 updateProfiles(curProfileItem.base.name, curItem)
//             }
//         }
//     }
// }

// addProfiles()



