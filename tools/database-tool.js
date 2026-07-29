// Tools for material database
const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, '..', 'data/')
const databaseFile = dirname + 'material_database.json'
const {readProfiles} = require('./config')
const convertToPrinterFormat = require('./jsonhandler.js')
let newDatabase
let startCount = 0
let newIds = []

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

const removeDuplicates = () => {
    // Keep every profile we just added, plus any stock entry a custom profile didn't override
    newDatabase.result.list = newDatabase.result.list.filter((entry, index) => {
        return index >= startCount || !newIds.includes(entry.base.id)
    })
    newDatabase.result.count = newDatabase.result.list.length
    writeDatabase(newDatabase)
}

const createProfile = (newMaterial) => {
    newDatabase.result.list.push(newMaterial)
    newDatabase.result.count += 1
    newIds.push(newMaterial.base.id)
}

const addProfiles = () => {
    newDatabase = readDatabase()
    startCount = newDatabase.result.count
    let presets = readProfiles()
    for (item in presets) {
        const updatedFilamentEntry = convertToPrinterFormat(presets[item])
        createProfile(updatedFilamentEntry)
    }
    removeDuplicates()
}

module.exports = addProfiles