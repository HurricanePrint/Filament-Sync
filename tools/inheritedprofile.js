const fs = require('fs')
let profiles = []

const getGenericProfile = (profile, genericDir) => {
    const genericName = profile.inherits
    const entries = fs.readdirSync(genericDir, { withFileTypes: true, recursive: true });
    let genericProfile, genericProfileJson, baseName
    for (entry in entries) {
        let name = entries[entry].name.slice(0, -5)
        if (name == genericName) {
            if(name.endsWith('@System')) {
                baseName = name.slice(0,-7)
                baseName += '@base'
                genericProfile = fs.readFileSync(entries[entry].path+ '/' + baseName + '.json')
                genericProfileJson = JSON.parse(genericProfile)
                if(genericProfileJson.inherits){
                    profiles.push(genericProfileJson)
                    getGenericProfile(genericProfileJson, genericDir)
                }
                break   
            }
            genericProfile = fs.readFileSync(entries[entry].parentPath+ '/' + name + '.json')
            genericProfileJson = JSON.parse(genericProfile)
            if(genericProfileJson.inherits){
                profiles.push(genericProfileJson)
                getGenericProfile(genericProfileJson, genericDir)
                break
            }
            profiles.push(genericProfileJson)
            break
        }
    }
    return profiles
}

const createCustomProfile = (profile, genericDir) => {
    profiles.push(profile)
    const genericProfiles = getGenericProfile(profile, genericDir)
    let newProfile = {}
    for(let profile = genericProfiles.length; profile >= 0; profile-- ) {
        newProfile = Object.assign({},newProfile,genericProfiles[profile])
    }
    newProfile = Object.fromEntries(Object.entries(newProfile).sort())
    return newProfile
}

module.exports = createCustomProfile