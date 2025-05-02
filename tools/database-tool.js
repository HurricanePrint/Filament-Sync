// Tools for material database
const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, '..', 'data/')
const databaseFile = dirname + 'material_database.json'
const {readProfiles} = require('./config')
const convertToPrinterFormat = require('./jsonhandler.js')

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

const createProfile = (newMaterial) => {
    let newDatabase = readDatabase()
    newDatabase.result.list.push(newMaterial)
    newDatabase.result.count += 1
    writeDatabase(newDatabase)
}

const addProfiles = () => {
    let presets = readProfiles()

    for (item in presets) {
        const updatedFilamentEntry = convertToPrinterFormat(presets[item])
        createProfile(updatedFilamentEntry)
    }
}

module.exports = addProfiles