const fs = require('fs')
const os = require('os')
const {sendFile} = require('./sftp.js')
const dirname = __dirname
const defaultDatabaseFile = fs.readFileSync(dirname+'/sourcedata/material_database.json')
const defaultOptionFile = fs.readFileSync(dirname+'/sourcedata/material_option.json')

const getOSInfo = () => {
    return {
        'osType' : os.type(),
        'homeDir' : os.userInfo().homedir
    }
}

const initData = () => {
    if (!fs.existsSync('./data')){
        fs.mkdirSync('./data');
    }
    let dir = './data/'
    let defaultDatabase = {'name': 'material_database.json', 'data': JSON.parse(defaultDatabaseFile)}
    let defaultOptions = {'name': 'material_option.json', 'data': JSON.parse(defaultOptionFile)}
    let files = [defaultDatabase, defaultOptions]
    if(fs.readdirSync(dir).length == 0) {
        for (file in files) {
            fs.writeFileSync(dir+files[file].name, JSON.stringify(files[file].data, null, "\t"))
        }
    }
}

const loadCustomProfiles = () => {
    let {osType, homeDir} = getOSInfo()
    let foundPresets = []
    let presets = []
    let directory, directoryFiles, orcaslicerDir, crealityDir
    switch(osType) { 
        case 'Darwin':
            orcaslicerDir = homeDir + '/Library/Application Support/OrcaSlicer/user/default/filament/base/'
            directory = orcaslicerDir
            directoryFiles = fs.readdirSync(orcaslicerDir)
            if (directoryFiles[0] == '.DS_Store') directoryFiles.splice(0,1)
            break
        case 'Linux': 
            orcaslicerDir = homeDir + '/.config/OrcaSlicer/user/default/filament/base/'
            directory = orcaslicerDir
            directoryFiles = fs.readdirSync(orcaslicerDir)
            break
        case 'Windows_NT': 
            orcaslicerDir = homeDir + '/AppData/Roaming/OrcaSlicer/user/default/filament/base/'
            directory = orcaslicerDir
            directoryFiles = fs.readdirSync(orcaslicerDir)
            break
        default:  
            console.log("Unsupported OS"); 
    }
    foundPresets = directoryFiles.filter(preset => preset.includes('.json'))
    for (item in foundPresets) {
        let parsedPreset = JSON.parse(fs.readFileSync(directory+foundPresets[item]))
        presets.push(parsedPreset)
    }
    return presets
}

const sendToPrinter = () => {
    sendFile('material_database.json', 'material_option.json')
}

module.exports = {initData, loadCustomProfiles, sendToPrinter}
