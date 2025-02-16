const {readOptions, writeOptions} = require('./config.js')

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
                            console.log('4')
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

const removeFilament = (vendor, type, name) => {
    let material_option = readOptions()
    let item, filamentType
    for(item in material_option) {
        if (item == vendor) {
            for(filamentType in material_option[item]) {
                if (filamentType == type) {
                    let newString = material_option[item][filamentType]
                    let index = newString.indexOf(name)
                    if (index == 0) {
                        let wordToDelete
                        if(newString.length > name.length) {
                            wordToDelete = name + '\n'
                        } else {
                            wordToDelete = name
                        }
                        
                        const tempStr = newString.replace(wordToDelete, '')
                        if (tempStr == '') {
                            delete material_option[vendor][type]
                        } else {
                            material_option[vendor][type] = tempStr
                        }
                        
                        writeOptions(material_option)
                        return
                    } else if (index >= 1) {
                        let wordToDelete = '\n' + name
                        const tempStr = newString.replace(wordToDelete, '')
                        material_option[vendor][type] = tempStr
                        writeOptions(material_option)
                        return
                    } else if (index == -1) return console.log('Filament not found')
                } 
            } return console.log('Filament Type not found')
        } 
    } return console.log('Vendor not found')

}

const removeType = (vendor, type) => {
    let materialOption = readOptions()
    let tempOptions = materialOption[vendor]
    let removedType = delete tempOptions[type]
    let newOptions = Object.assign({}, tempOptions, removedType) 
 
    materialOption[vendor] = newOptions
    writeOptions(materialOption)
}


const removeVendor = (vendor) => {
    let materialOption = readOptions()
    let removedVendor = delete materialOption[vendor]
    let newOptions = Object.assign({}, materialOption, removedVendor)
    
    materialOption = newOptions
    writeOptions(materialOption)
}

module.exports = {addFilament, removeFilament, removeType, removeVendor}