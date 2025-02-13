const {createProfile, deleteProfile, readProfile, updateProfiles} = require('./database-tool.js')
const {addFilament, removeFilament, removeType, removeVendor} = require('./options-tool.js')
const {readDatabase, updateDatabase, readOptions, updateOptions, loadCustomProfiles, loadFilamentPresets} = require('./config.js')

// read and store options list

// compare that all slicer profiles are in options list

// read and store printer profiles

// compare that all slicer profiles are in print profiles list



// If options are missing
    // add options to printer

// If profiles are missing
    // add profiles to printer


// If profiles are changed
    // update profiles on printer

// If profiles have been removed 
    // remove profiles from printer


