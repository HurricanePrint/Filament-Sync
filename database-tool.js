const {readDatabase, writeDatabase} = require('./config.js')

const findKey = (id) => {
    let index = 0
    let materialList = readDatabase().result.list
    for (item in materialList) {
        if (materialList[item].base.id == id) {
            return index
        }
        index += 1
    }
}

const readProfile = (materialId) => {
    let materialKey = findKey(materialId)
    let materialList = readDatabase().result.list
    let material = materialList[materialKey]
    return {material, materialKey}
}

let createProfile = (newMaterial) => {
    let newDatabase = readDatabase()
    newDatabase.result.list.push(newMaterial)
    newDatabase.result.count += 1
    writeDatabase(newDatabase)
}

let deleteProfile = (name) => {
    let profile = findKey(name)
    let newList = readDatabase()
    newList.result.list.splice(profile,1)
    newList.result.count -= 1
    writeDatabase(newList)
}

const updateProfiles = (materialUpdate) => {
    let materialToUpdate = materialUpdate
    let {materialKey} = readProfile(materialToUpdate.base.id)
    let updatedDatabase = readDatabase()
    updatedDatabase.result.list[materialKey] = materialUpdate
    writeDatabase(updatedDatabase)
}

module.exports = {createProfile, deleteProfile, readProfile, updateProfiles}