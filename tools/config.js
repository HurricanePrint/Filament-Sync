const fs = require('fs')
const os = require('os')
const path = require('path')
const dirname = path.join(__dirname, 'sourcedata/')
const defaultDatabaseFile = fs.readFileSync(dirname + 'material_database.json')
const defaultOptionFile = fs.readFileSync(dirname + 'material_option.json')
const {sendFiles} = require('./scp')
const {SLICER, USERID} = require('../user-config')
let loadedProfiles = []
let filteredProfiles = []

const getOSInfo = () => {
    return {
        'osType': os.type(),
        'homeDir': os.userInfo().homedir
    }
}

const checkCrealityFormatting = (profiles) => {
    for(let profile of profiles) {
        if(typeof Object.values(profile)[0] != 'object') {
            for(let key in profile) {
                profile[key] = [profile[key]]
            }
        }
    }
    return profiles
}

const loadCustomProfiles = () => {
    const {osType, homeDir} = getOSInfo()
    let profiles = []
    let orcaFiles, crealityFiles
    let orcaProfileDir, crealityProfileDir
    switch (osType) {
        case 'Darwin':
            orcaProfileDir = homeDir + '/Library/Application Support/OrcaSlicer/user/' + USERID + '/filament/base/'
            crealityProfileDir = homeDir + '/Library/Application Support/Creality/Creality Print/6.0/user/' + USERID + '/filament/base/'
            if (SLICER == 'orca') {
                orcaFiles = fs.readdirSync(orcaProfileDir)
                if (orcaFiles[0] == '.DS_Store') orcaFiles.splice(0, 1)
                orcaFiles = orcaFiles.filter(profile => profile.includes('.json'))
                for (item in orcaFiles) {
                    let parsedProfile = JSON.parse(fs.readFileSync(orcaProfileDir + orcaFiles[item]))
                    profiles.push(parsedProfile)
                }
            }
            if (SLICER == 'creality') {
                crealityFiles = fs.readdirSync(crealityProfileDir)
                if (crealityFiles[0] == '.DS_Store') crealityFiles.splice(0, 1)
                crealityFiles = crealityFiles.filter(profile => profile.includes('.json'))
                for (item in crealityFiles) {
                    let parsedProfile = JSON.parse(fs.readFileSync(crealityProfileDir + crealityFiles[item]))
                    profiles.push(parsedProfile)
                }
            }
            break
        case 'Linux':
            orcaProfileDir = homeDir + '/.config/OrcaSlicer/user/' + USERID + '/filament/base/'
            crealityProfileDir = homeDir + '/.config/Creality/Creality Print/6.0/user/' + USERID + '/filament/base/'
            if (SLICER == 'orca') {
                orcaFiles = fs.readdirSync(orcaProfileDir)
                if (orcaFiles[0] == '.DS_Store') orcaFiles.splice(0, 1)
                orcaFiles = orcaFiles.filter(profile => profile.includes('.json'))
                for (item in orcaFiles) {
                    let parsedProfile = JSON.parse(fs.readFileSync(orcaProfileDir + orcaFiles[item]))
                    profiles.push(parsedProfile)
                }
            }
            if (SLICER == 'creality') {
                crealityFiles = fs.readdirSync(crealityProfileDir)
                if (crealityFiles[0] == '.DS_Store') crealityFiles.splice(0, 1)
                crealityFiles = crealityFiles.filter(profile => profile.includes('.json'))
                for (item in crealityFiles) {
                    let parsedProfile = JSON.parse(fs.readFileSync(crealityProfileDir + crealityFiles[item]))
                    profiles.push(parsedProfile)
                }
            }
            break
        case 'Windows_NT':
            orcaProfileDir = homeDir + '/AppData/Roaming/OrcaSlicer/user/' + USERID + '/filament/base/'
            crealityProfileDir = homeDir + '/AppData/Roaming/Creality/Creality Print/6.0/user/' + USERID + '/filament/base/'
            if (SLICER == 'orca') {
                orcaFiles = fs.readdirSync(orcaProfileDir)
                if (orcaFiles[0] == '.DS_Store') orcaFiles.splice(0, 1)
                orcaFiles = orcaFiles.filter(profile => profile.includes('.json'))
                for (item in orcaFiles) {
                    let parsedProfile = JSON.parse(fs.readFileSync(orcaProfileDir + orcaFiles[item]))
                    profiles.push(parsedProfile)
                }
            }
            if (SLICER == 'creality') {
                crealityFiles = fs.readdirSync(crealityProfileDir)
                if (crealityFiles[0] == '.DS_Store') crealityFiles.splice(0, 1)
                crealityFiles = crealityFiles.filter(profile => profile.includes('.json'))
                for (item in crealityFiles) {
                    let parsedProfile = JSON.parse(fs.readFileSync(crealityProfileDir + crealityFiles[item]))
                    profiles.push(parsedProfile)
                }
            }
            break
        default:
            console.error("Unsupported OS");
    }
    if(SLICER == 'creality') {
        loadedProfiles = checkCrealityFormatting(profiles)
    }else loadedProfiles = profiles
}

const filterProfiles = () => {
    let profiles = loadedProfiles
    if(profiles == undefined) {
        console.error("No profiles in directory")
        process.exit()
    }
    for(let profile in profiles) {
        if(profiles[profile].filament_notes != undefined && profiles[profile].filament_notes != '') {
            filteredProfiles.push(profiles[profile])
        } else {
            console.error('Ignoring Filament', `[`+profiles[profile].filament_vendor[0], profiles[profile].name+`]`, "since it's missing required filament notes")
            console.error('Check the instructions for info on how to add them')
            console.error('https://github.com/HurricanePrint/Filament-Sync#creating-custom-filament-presets')
        }
    }
}

const readProfiles = () => {
    return filteredProfiles
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
    // let defaultOptions = {
    //     'name': 'material_option.json',
    //     'data': JSON.parse(defaultOptionFile)
    // }
    // let files = [defaultDatabase, defaultOptions]
    let files = [defaultDatabase]
    for (file in files) {
        fs.writeFileSync(dir + files[file].name, JSON.stringify(files[file].data, null, "\t"))
    }
    loadCustomProfiles()
    filterProfiles()
}

const sendToPrinter = () => {
    sendFiles()
}

module.exports = {initData, readProfiles, sendToPrinter}