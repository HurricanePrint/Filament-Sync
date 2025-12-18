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
    let databaseList = newDatabase.result.list
    let filteredDatabase
    for(let entry = 0; entry <= startCount-1; entry++) {
        let entryID = databaseList[entry].base.id
        for(id of newIds) {
            if(entryID == id) {
                console.log('remove')
                filteredDatabase = databaseList.slice(entry+1, newDatabase.count)
                newDatabase.result.count -=1
            }
        }
    }
    newDatabase.result.list = filteredDatabase
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