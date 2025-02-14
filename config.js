const fs = require('fs')
const os = require('os')
const dirname = __dirname
const defaultDatabaseFile = dirname+'/sourcedata/material_database.json'
const defaultOptionFile = dirname+'/sourcedata/material_option.json'
const databaseFile = dirname+'/data/material_database.json'
const optionsFile = dirname+'/data/material_option.json'
const material_database = JSON.parse(fs.readFileSync(databaseFile))
const material_option = JSON.parse(fs.readFileSync(optionsFile))
const {sendFile} = require('./sftp.js')

const presetDirectory = dirname+'/sourcedata/filamentpresets/'

const writeOptions = (options) => {
    fs.writeFile(optionsFile, JSON.stringify(options, null, "\t"), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

const writeDatabase = (database) => {
    fs.writeFile(databaseFile, JSON.stringify(database, null, "\t"), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

const initData = () => {
    let dir = './data/'
    let defaultDatabase = {'name': 'material_database.json', 'data': JSON.parse(fs.readFileSync(defaultDatabaseFile))}
    let defaultOptions = {'name': 'material_option.json', 'data': JSON.parse(fs.readFileSync(defaultOptionFile))}
    let files = [defaultDatabase, defaultOptions]
    try {
        fs.readdirSync(dir)
        if(fs.readdirSync(dir).length == 0) {
            for (file in files) {
                fs.writeFileSync(dir+files[file].name, JSON.stringify(files[file].data, null, "\t"))
            }
        }
    } catch(error) {
        try {
            fs.mkdirSync('data')
        } catch(error) {
            console.error(error)
        }
        for (file in files) {
            fs.writeFileSync(dir+files[file].name, JSON.stringify(files[file].data, null, "\t"))
        }
    }
    let tempDir = './temp/'
    try {
        fs.readdirSync(tempDir)
    } catch(error) {
        fs.mkdirSync(tempDir)
    }
}

const readDatabase = () => {
    initData()
    let database = JSON.parse(fs.readFileSync('./data/material_database.json'))
    return database
}

const updateDatabase = (newDatabase) => {
    let oldDatabase = readDatabase()
    let updatedDatabase = Object.assign({}, oldDatabase, newDatabase)
    writeDatabase(updatedDatabase)
}

const readOptions = () => {
    initData()
    let options = JSON.parse(fs.readFileSync('./data/material_option.json'))
    return options
}
const updateOptions = (newOptions) => {
    let oldOptions = readOptions()
    let updatedOptions = Object.assign({}, oldOptions, newOptions)
    writeOptions(updatedOptions)
}

const getOSInfo = () => {
    return {
        'osType' : os.type(),
        'homeDir' : os.userInfo().homedir
    }
}

const loadCustomProfiles = () => {
    let {osType, homeDir} = getOSInfo()
    let presets = []
    let directory, directoryFiles
    switch(osType) { 
        case 'Darwin': 
            directory = homeDir + '/Library/Application Support/OrcaSlicer/user/default/filament/base/'
            directoryFiles = fs.readdirSync(directory)
            for (item in directoryFiles) {
                if (directoryFiles[item].endsWith('.json')) {
                    presets.push(JSON.parse(fs.readFileSync(directory+directoryFiles[item])))
                }
            }
            return presets
            break; 
        case 'Linux':  
            directory = homeDir + '/.config/OrcaSlicer/user/default/filament/base'
            directoryFiles = fs.readdirSync(directory)
            for (item in directoryFiles) {
                if (directoryFiles[item].endsWith('.json')) {
                    presets.push(JSON.parse(fs.readFileSync(directory+directoryFiles[item])))
                }
            }
            return presets
            break; 
        case 'Windows_NT': 
            directory = homeDir + "/AppData/Roaming/OrcaSlicer/user/default/filament/base"
            directoryFiles = fs.readdirSync(directory)
            for (item in directoryFiles) {
                if (directoryFiles[item].endsWith('.json')) {
                    presets.push(JSON.parse(fs.readFileSync(directory+directoryFiles[item])))
                }
            }
            return presets
            break;     
        default:  
            console.log("Unsupported OS"); 
    } 
}

const loadFilamentPresets = () => {
    let presets = []
    let directoryFiles = fs.readdirSync(presetDirectory)
    for(item in directoryFiles) {
        presets.push(JSON.parse(fs.readFileSync(presetDirectory+directoryFiles[item])))
    }
    return presets
} 


const sendToPrinter = () => {
    sendFile('material_database.json', 'material_option.json')
}

module.exports = {material_database, material_option, loadCustomProfiles, loadFilamentPresets, writeOptions, writeDatabase, readDatabase, updateDatabase, readOptions, updateOptions, sendToPrinter}
