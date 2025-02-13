var fs = require('fs');

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

//load presets
let loadFilamentPresets = () => {
    let presets = []
    let directoryFiles = fs.readdirSync(presetDirectory)
    for(item in directoryFiles) {
        presets.push(JSON.parse(fs.readFileSync(presetDirectory+directoryFiles[item])))
    }
    return presets
} 

const filamentPresets = loadFilamentPresets()

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

module.exports = {material_database, material_option, filamentPresets, writeOptions, writeDatabase, testProfile}
