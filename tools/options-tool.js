// Functions for material option
const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, '..', 'data/')
const optionsFile = dirname + 'material_option.json'
const {loadCustomProfiles} = require('./config')

const readOptions = () => {
    let options = JSON.parse(fs.readFileSync(optionsFile))
    return options
}

const writeOptions = (options) => {
    fs.writeFileSync(optionsFile, JSON.stringify(options, null, "\t"), function (err) {
        if (err) {
            console.error('\nError creating options file')
            console.error("Make sure directory isn't set read-only") 
            console.error(err) 
        }
    })
}

const addFilament = (vendor, type, name) => {
    let item, filamentType
    let options = readOptions()

    for (item in options) {
        materialOption = options
        if (item == vendor) {
            for (filamentType in options[item]) {
                if (filamentType === type) {
                    let newString = materialOption[item][filamentType]
                    let word = name
                    let index = newString.indexOf(word)
                    if (index !== -1) {
                        return
                    } else {
                        if (filamentType == type) {
                            const oldValues = materialOption[vendor]
                            const tempName = oldValues[type] + "\n" + [name]
                            const newData = Object.assign({}, {
                                [type]: tempName
                            })
                            let newOptions = Object.assign({}, materialOption[vendor], newData)
                            materialOption[vendor] = newOptions
                            writeOptions(materialOption)
                            return
                        }
                    }
                }
            }
            const oldValues = materialOption[vendor]
            const newValues = {
                [type]: name
            }
            const newData = Object.assign({}, oldValues, newValues)
            materialOption[vendor] = newData
            writeOptions(materialOption)
            return
        }
    }
    const newVendor = new Object({
        [vendor]: {
            [type]: name
        }
    })
    const newData = Object.assign({}, materialOption, newVendor)
    materialOption = newData
    writeOptions(materialOption)
}

const addOptions = () => {
    let customProfiles = loadCustomProfiles()
    for (item in customProfiles) {
        let curItem = customProfiles[item]
        if (curItem.filament_notes != undefined && curItem.filament_notes.length != 0) {
            let curItemData = JSON.parse(curItem.filament_notes)
            addFilament(curItemData.vendor, curItemData.type, curItemData.name)
        } else {
            console.error('\nFilament notes are missing in filament', curItem.filament_vendor[0], curItem.name)
            console.error('Check the instructions for info on how to add them')
            console.error('https://github.com/HurricanePrint/Filament-Sync#creating-custom-filament-presets')
            process.exit()
        }
    }
}

module.exports = addOptions