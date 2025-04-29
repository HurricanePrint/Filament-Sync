// Tools for material database
const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, '..', 'data/')
const databaseFile = dirname + 'material_database.json'

const readDatabase = () => {
    let database = JSON.parse(fs.readFileSync(databaseFile))
    return database
}

const writeDatabase = (database) => {
    fs.writeFileSync(databaseFile, JSON.stringify(database, null, "\t"), function (err) {
        if (err) {
            console.error('\nError creating database file')
            console.error("Make sure directory isn't set read-only")
            console.error(err)
        }
    })
}

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
    return {materialKey}
}

let createProfile = (newMaterial) => {
    let newDatabase = readDatabase()
    newDatabase.result.list.push(newMaterial)
    newDatabase.result.count += 1
    writeDatabase(newDatabase)
}

const updateProfiles = (materialUpdate) => {
    let materialToUpdate = materialUpdate
    let {materialKey} = readProfile(materialToUpdate.base.id)
    let updatedDatabase = readDatabase()
    updatedDatabase.result.list[materialKey] = materialUpdate
    writeDatabase(updatedDatabase)
}

module.exports = {
    createProfile,
    readProfile,
    updateProfiles,
    readDatabase,
    writeDatabase
}