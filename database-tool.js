var fs = require('fs');

const material_database = JSON.parse(fs.readFileSync('test_database.json'))
const materialResult = material_database.result
const materialListBase = materialResult.list
const materialList = materialListBase

// finds the key of searched filament (by name)
const findKey = (key) => {
    let index = 0
    for (items in materialList) {
        index += 1
        for (profiles in materialList[items]) {
            let tempVal = materialList[items][profiles]
            if (tempVal.name === key) {
                return index - 1
            }
        }
    }
}

let createProfile = (filamentProps, materialList) => {
    const newProfile = filamentProps
    const oldList = materialList
    // console.log(oldList)
    let newList = Object.assign(oldList, newProfile)
    let tempA = []
    tempA.push(oldList[0])
    // tempA.push(newList)
    console.log(tempA)
    // let newList = Object.assign({}, oldList, newProfile)
    // console.log(newList)
}

let testProfile = {
    "engineVersion":"3.0.0",
    "printerIntName":"F008",
    "nozzleDiameter":[
      "0.4"
    ],
    "kvParam":{
      "temperature_vitrification":"75",
      "textured_plate_temp":"70",
      "textured_plate_temp_initial_layer":"70"
    },
    "base":{
      "id":"06002",
      "brand":"TEST",
      "name":"Hyper TEST",
      "meterialType":"TEST",
      "colors":[
        "#000000"
      ],
      "density":1.275,
      "diameter":"1.75"
    }
  }

createProfile(testProfile, materialList)

let deleteProfile = (name, materialList) => {
    let profile = findKey(name)
    let list = materialList
    delete list[profile]
    materialList = list
    // write to file
    fs.writeFile("test_database.json", JSON.stringify(materialList, null, "\t"), function (err) {
        if (err) {
            console.log(err);
        }
    });
}


const readProfile = (materialName) => {
    let foundMaterial = materialList[findKey(materialName)]
    return foundMaterial
}

const updateProfiles = (materialName, newProperties) => {
    let material = readMaterialProperties(materialName)
    const props = Object.assign({}, material, newProperties)
    console.log(props)
    // working but needs a deep merge to write in new vales and not delete non updated values

    //write to file
}

// updateMaterialProperties('Hyper PLA', {nozzleDiameter: ['0.2'],base: {id:'1', materialType:'PETG',dryingTemp:'50',dryingTime:'100'}})