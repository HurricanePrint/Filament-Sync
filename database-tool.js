const {material_database, writeDatabase, testProfile} = require('./config.js')
let materialList = material_database.result.list

const findKey = (key) => {
    let index = 0
    for (item in materialList) {
        index += 1
        for (profile in materialList[item]) {
            let tempVal = materialList[item][profile]
            if (tempVal.name == key) {               
                return index -= 1
            }
        }
    }
}

const readProfile = (materialName) => {
    let materialKey = findKey(materialName)
    let material = materialList[materialKey]
    return {material, materialKey}
}

let createProfile = (filamentProps) => {
    const newProfile = filamentProps
    const oldList = materialList
    let tempArray = []
    tempArray.push(oldList)
    tempArray[0].push(newProfile)
    material_database.result.list = tempArray[0]
    material_database.result.count += 1
    writeDatabase(material_database)
}

let deleteProfile = (name) => {
    let profile = findKey(name)
    let list = materialList
    list.splice(profile,1)
    // delete list[profile]
    material_database.result.list = list
    material_database.result.count -= 1
    // write to file
    console.log(material_database)
    writeDatabase(material_database)
}

const updateProfiles = (materialName, newProperties) => {
    let {material, materialKey} = readProfile(materialName)
    let updatedMaterial = material
    for (entry in material) {
        if(material[entry] !== newProperties[entry]) {
            if(typeof(material[entry]) === 'object') {
                for (subEntry in material[entry]) {
                    if(material[entry][subEntry] !== newProperties[entry][subEntry]) {
                        updatedMaterial[entry][subEntry] = newProperties[entry][subEntry]
                    }
                }
            }
            updatedMaterial[entry] = newProperties[entry]
        }
    }
    material_database.result.list[materialKey] = updatedMaterial
    writeDatabase(material_database)
}

module.exports = {createProfile, deleteProfile, readProfile, updateProfiles}