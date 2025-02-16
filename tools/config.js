const fs = require('fs')
const os = require('os')
const path = require('path')
const dirname = path.join(__dirname, '..', 'sourcedata/')
const defaultDatabaseFile = fs.readFileSync(dirname + 'material_database.json')
const defaultOptionFile = fs.readFileSync(dirname + 'material_option.json')
const {sendFile} = require('./sftp.js')

const getOSInfo = () => {
    return {
        'osType': os.type(),
        'homeDir': os.userInfo().homedir
    }
}

const initData = () => {
    if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
    }
    let dir = './data/'
    let defaultDatabase = {
        'name': 'material_database.json',
        'data': JSON.parse(defaultDatabaseFile)
    }
    let defaultOptions = {
        'name': 'material_option.json',
        'data': JSON.parse(defaultOptionFile)
    }
    let files = [defaultDatabase, defaultOptions]
    if (fs.readdirSync(dir).length == 0) {
        for (file in files) {
            fs.writeFileSync(dir + files[file].name, JSON.stringify(files[file].data, null, "\t"))
        }
    }
}

const loadCustomProfiles = () => {
    const {osType, homeDir} = getOSInfo()
    let presets = []
    let orcaFiles, crealityFiles
    let orcaPresetDir, crealityPresetDir
    switch (osType) {
        case 'Darwin':
            orcaPresetDir = homeDir + '/Library/Application Support/OrcaSlicer/user/default/filament/base/'
            crealityPresetDir = homeDir + '/Library/Application Support/Creality/Creality Print/6.0/user/default/filament/base/'
            if (fs.existsSync(orcaPresetDir)) {
                orcaFiles = fs.readdirSync(orcaPresetDir)
                if (orcaFiles[0] == '.DS_Store') orcaFiles.splice(0, 1)
                orcaFiles = orcaFiles.filter(preset => preset.includes('.json'))
                for (item in orcaFiles) {
                    let parsedPreset = JSON.parse(fs.readFileSync(orcaPresetDir + orcaFiles[item]))
                    presets.push(parsedPreset)
                }
            }
            if (fs.existsSync(crealityPresetDir)) {
                crealityFiles = fs.readdirSync(crealityPresetDir)
                if (crealityFiles[0] == '.DS_Store') crealityFiles.splice(0, 1)
                crealityFiles = crealityFiles.filter(preset => preset.includes('.json'))
                for (item in crealityFiles) {
                    let parsedPreset = JSON.parse(fs.readFileSync(crealityPresetDir + crealityFiles[item]))
                    presets.push(parsedPreset)
                }
            }
            break
        case 'Linux':
            orcaPresetDir = homeDir + '/.config/OrcaSlicer/user/default/filament/base/'
            crealityPresetDir = homeDir + '/.config/Creality/Creality Print/6.0/user/default/filament/base/'
            if (fs.existsSync(orcaPresetDir)) {
                orcaFiles = fs.readdirSync(orcaPresetDir)
                if (orcaFiles[0] == '.DS_Store') orcaFiles.splice(0, 1)
                orcaFiles = orcaFiles.filter(preset => preset.includes('.json'))
                for (item in orcaFiles) {
                    let parsedPreset = JSON.parse(fs.readFileSync(orcaPresetDir + orcaFiles[item]))
                    presets.push(parsedPreset)
                }
            }
            if (fs.existsSync(crealityPresetDir)) {
                crealityFiles = fs.readdirSync(crealityPresetDir)
                if (crealityFiles[0] == '.DS_Store') crealityFiles.splice(0, 1)
                crealityFiles = crealityFiles.filter(preset => preset.includes('.json'))
                for (item in crealityFiles) {
                    let parsedPreset = JSON.parse(fs.readFileSync(crealityPresetDir + crealityFiles[item]))
                    presets.push(parsedPreset)
                }
            }
            break
        case 'Windows_NT':
            orcaPresetDir = homeDir + '/AppData/Roaming/OrcaSlicer/user/default/filament/base/'
            crealityPresetDir = homeDir + '/AppData/Roaming/Creality/Creality Print/6.0/user/default/filament/base/'
            if (fs.existsSync(orcaPresetDir)) {
                orcaFiles = fs.readdirSync(orcaPresetDir)
                if (orcaFiles[0] == '.DS_Store') orcaFiles.splice(0, 1)
                orcaFiles = orcaFiles.filter(preset => preset.includes('.json'))
                for (item in orcaFiles) {
                    let parsedPreset = JSON.parse(fs.readFileSync(orcaPresetDir + orcaFiles[item]))
                    presets.push(parsedPreset)
                }
            }
            if (fs.existsSync(crealityPresetDir)) {
                crealityFiles = fs.readdirSync(crealityPresetDir)
                if (crealityFiles[0] == '.DS_Store') crealityFiles.splice(0, 1)
                crealityFiles = crealityFiles.filter(preset => preset.includes('.json'))
                for (item in crealityFiles) {
                    let parsedPreset = JSON.parse(fs.readFileSync(crealityPresetDir + crealityFiles[item]))
                    presets.push(parsedPreset)
                }
            }
            break
        default:
            console.log("Unsupported OS");
    }
    return presets
}

const sendToPrinter = () => {
    sendFile('material_database.json', 'material_option.json')
}

module.exports = {initData, loadCustomProfiles, sendToPrinter}