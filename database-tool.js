const {material_database, writeDatabase} = require('./config.js')
let materialList = material_database.result.list

const findKey = (id) => {
    let index = 0
    for (item in materialList) {
        if (materialList[item].base.id == id) {
            return index
        }
        index += 1
    }
}

const readProfile = (materialId) => {
    let materialKey = findKey(materialId)
    let material = materialList[materialKey]
    return {material, materialKey}
}

let createProfile = (newMaterial) => {
    let oldList = materialList
    oldList.push(newMaterial)
    material_database.result.count += 1
    writeDatabase(material_database)
}

let deleteProfile = (name) => {
    let profile = findKey(name)
    let list = materialList
    list.splice(profile,1)
    material_database.result.list = list
    material_database.result.count -= 1
    writeDatabase(material_database)
}

const updateProfiles = (materialUpdate) => {
    let materialToUpdate = materialUpdate
    let {materialKey} = readProfile(materialToUpdate.base.id)
    material_database.result.list[materialKey] = materialUpdate
    writeDatabase(material_database)
}

module.exports = {createProfile, deleteProfile, readProfile, updateProfiles}