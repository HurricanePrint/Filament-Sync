const fs = require('fs')
const os = require('os')

//For Testing
let testProfile = JSON.parse(fs.readFileSync('test_profile.json'))
//
const databaseFile = 'test_database.json'
const optionsFile = 'test_options.json'
//load material database
const material_database = JSON.parse(fs.readFileSync(databaseFile))
//load material options
const material_option = JSON.parse(fs.readFileSync(optionsFile))

const presetDirectory = './source-data/filamentpresets/'

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
            directory = homeDir + '/Library/Application Support/OrcaSlicer/user/default/filament/'
            directoryFiles = fs.readdirSync(directory)
            for (item in directoryFiles) {
                if (directoryFiles[item].endsWith('.json')) {
                    presets.push(JSON.parse(fs.readFileSync(directory+directoryFiles[item])))
                }
            }
            return presets
            break; 
        case 'Linux':  
            directory = homeDir + '/.config/OrcaSlicer/user/default/filament'
            directoryFiles = fs.readdirSync(directory)
            for (item in directoryFiles) {
                if (directoryFiles[item].endsWith('.json')) {
                    presets.push(JSON.parse(fs.readFileSync(directory+directoryFiles[item])))
                }
            }
            return presets
            break; 
        case 'Windows_NT': 
            directory = homeDir + "/AppData/Roaming/OrcaSlicer/user/default/filament"
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

module.exports = {material_database, material_option, loadCustomProfiles, loadFilamentPresets, writeOptions, writeDatabase, testProfile}
