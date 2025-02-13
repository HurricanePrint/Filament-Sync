let {material_option, writeOptions} = require('./config.js')

const addFilament = (vendor, type, name, material_option) => {
    let item, filamentType
    for (item in material_option) {
        if (item == vendor) {
            for (filamentType in material_option[item]) {
                if (filamentType === type) {
                    let newString = material_option[item][filamentType]
                    let word = name
                    let index = newString.indexOf(word)
                    if (index !== -1) {
                        console.log('Name already exists')
                        return
                    } else {
                        if (filamentType == type) {
                            const oldValues = material_option[vendor]
                            const tempName = oldValues[type] + "\n" + [name]
                            const newData = Object.assign({}, {
                                [type]: tempName
                            })
                            let newOptions = Object.assign({}, material_option[vendor], newData)
                            material_option[vendor] = newOptions
                            writeOptions(material_option)
                            return
                        }
                        
                    }
                }
            }
                const oldValues = material_option[vendor]
                const newValues = {
                    [type]: name
                }
                const newData = Object.assign({}, oldValues, newValues)
                material_option[vendor] = newData
                fs.writeFile("test_options.json", JSON.stringify(material_option, null, "\t"), function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                return

        }
    }
    const newVendor = new Object({
        [vendor]: {
            [type]: name
        }
    })
    const oldValues = material_option
    const newData = Object.assign({}, oldValues, newVendor)
    material_option = newData
    fs.writeFile("test_options.json", JSON.stringify(material_option, null, "\t"), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

const removeFilament = (vendor, type, name, material_option) => {
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

const removeType = (vendor, type, material_option) => {
    let tempOptions = material_option[vendor]
    let removedType = delete tempOptions[type]
    let newOptions = Object.assign({}, tempOptions, removedType) 
 
    material_option[vendor] = newOptions
    writeOptions(material_option)
}


const removeVendor = (vendor) => {
    let tempOptions = material_option
    let removedVendor = delete material_option[vendor]
    let newOptions = Object.assign({}, tempOptions, removedVendor)
    
    material_option = newOptions
    writeOptions(material_option)
}

module.exports = {addFilament, removeFilament, removeType, removeVendor}