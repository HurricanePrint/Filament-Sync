const fs = require('fs')
const os = require('os')
const path = require('path')
const dirname = path.join(__dirname, 'sourcedata/')
const defaultDatabaseFile = fs.readFileSync(dirname + 'material_database.json')
const defaultOptionFile = fs.readFileSync(dirname + 'material_option.json')
const {SLICER, USERID} = require('../user-config')
const createCustomProfile = require('./inheritedprofile')
let profileDir, genericDir
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
    if (SLICER == 'orca') {
        switch(osType) {
            case 'Darwin':
                profileDir = homeDir + '/Library/Application Support/OrcaSlicer/user/' + USERID + '/filament/'
                genericDir = homeDir + '/Library/Application Support/OrcaSlicer/system/'
                break
            case 'Linux':
                if (fs.existsSync(homeDir + '/.config/OrcaSlicer/user/' + USERID + '/filament/')) {
                    profileDir = homeDir + '/.config/OrcaSlicer/user/' + USERID + '/filament/'
                    genericDir = homeDir + '/.config/OrcaSlicer/user/' + USERID + '/filament/'
                } if (fs.existsSync(homeDir + '/.var/app/io.github.softfever.OrcaSlicer/config/OrcaSlicer/user/' + USERID + '/filament/')) {
                    profileDir = homeDir + '/.var/app/io.github.softfever.OrcaSlicer/config/OrcaSlicer/user/' + USERID + '/filament/'
                    genericDir = homeDir + '/.var/app/io.github.softfever.OrcaSlicer/config/OrcaSlicer/system/'
                } else if (fs.existsSync(homeDir + '/.var/app/com.orcaslicer.OrcaSlicer/config/OrcaSlicer/user/' + USERID + '/filament/')) {
                    profileDir = homeDir + '/.var/app/com.orcaslicer.OrcaSlicer/config/OrcaSlicer/user/' + USERID + '/filament/'
                    genericDir = homeDir + '/.var/app/com.orcaslicer.OrcaSlicer/config/OrcaSlicer/system/'
                }
                break
            case 'Windows_NT':
                profileDir = homeDir + '/AppData/Roaming/OrcaSlicer/user/' + USERID + '/filament/'
                genericDir = homeDir + '/AppData/Roaming/OrcaSlicer/system/'
                break
        }
        orcaFiles = fs.readdirSync(profileDir,{recursive: true})
        if (orcaFiles[0] == '.DS_Store') orcaFiles.splice(0, 1)
        orcaFiles = orcaFiles.filter(profile => profile.includes('.json'))
        for (item in orcaFiles) {
            let parsedProfile = JSON.parse(fs.readFileSync(profileDir + orcaFiles[item]))
            profiles.push(parsedProfile)
        }
        loadedProfiles = profiles
    }else if (SLICER == 'creality') {
                switch(osType) {
            case 'Darwin':
                profileDir = homeDir + '/Library/Application Support/Creality/Creality Print/7.0/user/' + USERID + '/filament/'
                genericDir = homeDir + '/Library/Application Support/Creality/Creality Print/7.0/system/Creality/filament/'
                break
            case 'Linux':
                if (fs.existsSync(homeDir + '/.config/Creality/Creality Print/7.0/user/' + USERID + '/filament/')) {
                    profileDir = homeDir + '/.config/Creality/Creality Print/7.0/user/' + USERID + '/filament/'
                    genericDir = homeDir + '/.config/Creality/Creality Print/7.0/user/' + USERID + '/filament/'
                } else if (fs.existsSync(homeDir + '/.var/app/io.github.crealityofficial.CrealityPrint/config/Creality/Creality Print/7.0/user/' + USERID + '/filament/')) {
                    profileDir = homeDir + '/.var/app/io.github.crealityofficial.CrealityPrint/config/Creality/Creality Print/7.0/user/' + USERID + '/filament/'
                    genericDir = homeDir + '/.var/app/io.github.crealityofficial.CrealityPrint/config/Creality/Creality Print/7.0/system/Creality/filament/'
                }
                break
            case 'Windows_NT':
                profileDir = homeDir + '/AppData/Roaming/Creality/Creality Print/7.0/user/' + USERID + '/filament/'
                genericDir = homeDir + '/AppData/Roaming/Creality/Creality Print/7.0/system/Creality/filament/'
                break
        }
        crealityFiles = fs.readdirSync(profileDir,{recursive: true})
        if (crealityFiles[0] == '.DS_Store') crealityFiles.splice(0, 1)
        crealityFiles = crealityFiles.filter(profile => profile.includes('.json'))
        for (item in crealityFiles) {
            let parsedProfile = JSON.parse(fs.readFileSync(profileDir + crealityFiles[item]))
            profiles.push(parsedProfile)
        }
        loadedProfiles = checkCrealityFormatting(profiles)
    }
}

const filterProfiles = () => {
    let profiles = loadedProfiles
    if(profiles == undefined) {
        console.error("No profiles in directory")
        process.exit()
    }
    for(let profile in profiles) {
        if(profiles[profile].filament_notes != undefined && profiles[profile].filament_notes != '') {
            if(Object.keys(profiles[profile]).length <= 100) {
                profiles[profile] = createCustomProfile(profiles[profile], genericDir)
                filteredProfiles.push(profiles[profile])
            } else {
                filteredProfiles.push(profiles[profile])
            }          
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
    let defaultOptions = {
        'name': 'material_option.json',
        'data': JSON.parse(defaultOptionFile)
    }
    let files = [defaultDatabase, defaultOptions]
    for (file in files) {
        fs.writeFileSync(dir + files[file].name, JSON.stringify(files[file].data, null, "\t"))
    }
    loadCustomProfiles()
    filterProfiles()
}

module.exports = {initData, readProfiles}