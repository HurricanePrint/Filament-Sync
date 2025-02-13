const {material_database, writeDatabase, testProfile} = require('./config.js')
let materialList = material_database.result.list

const findKey = (key) => {
    let index = 0
    for (item in materialList) {
        index += 1
        for (profile in materialList[item]) {
            let tempVal = materialList[item][profile]
            if (tempVal.name == key) {               
                return index -= 1
            }
        }
    }
}

const readProfile = (materialName) => {
    let materialKey = findKey(materialName)
    let material = materialList[materialKey]
    return {material, materialKey}
}

let createProfile = (filamentProps) => {
    const newProfile = filamentProps
    const oldList = materialList
    let tempArray = []
    tempArray.push(oldList)
    tempArray[0].push(newProfile)
    material_database.result.list = tempArray[0]
    material_database.result.count += 1
    writeDatabase(material_database)
}

let deleteProfile = (name) => {
    let profile = findKey(name)
    let list = materialList
    list.splice(profile,1)
    material_database.result.list = list
    material_database.result.count -= 1
    writeDatabase(material_database)
}

const updateProfiles = (materialName, newProperties) => {
    let {material, materialKey} = readProfile(materialName)
    let updatedMaterial = material
    for (entry in material) {
        if(material[entry] !== newProperties[entry]) {
            if(typeof(material[entry]) === 'object') {
                for (subEntry in material[entry]) {
                    // console.log("1 ",material[entry][subEntry])
                    // console.log("2 ",newProperties)
                    if(material[entry][subEntry] !== newProperties[entry][subEntry]) {
                        updatedMaterial[entry][subEntry] = newProperties[entry][subEntry]
                    }
                }
            }
            updatedMaterial[entry] = newProperties[entry]
        }
    }
    material_database.result.list[materialKey] = updatedMaterial
    writeDatabase(material_database)
}

const convertToPrinterFormat = (newProfile) => {
    let curProfile = newProfile
    let curProfileNotes = JSON.parse(curProfile.filament_notes)
    let newObject = {
        "engineVersion": curProfile.version,
        "printerIntName": "F0008",
        "nozzleDiameter": ["0.4"],
        "kvParam": {
            "activate_air_filtration": curProfile.activate_air_filtration[0],
            "activate_chamber_temp_control": curProfile.activate_chamber_temp_control[0],
            "additional_cooling_fan_speed": curProfile.additional_cooling_fan_speed[0],
            "chamber_temperature": curProfile.chamber_temperature[0],
            "close_fan_the_first_x_layers": curProfile.close_fan_the_first_x_layers[0],
            "compatible_printers": curProfile.compatible_printers[0],
            "compatible_printers_condition": curProfile.compatible_printers_condition[0],
            "compatible_prints": curProfile.compatible_prints,
            "compatible_prints_condition": curProfile.compatible_prints_condition,
            "complete_print_exhaust_fan_speed": curProfile.complete_print_exhaust_fan_speed[0],
            "cool_cds_fan_start_at_height": "0.5",
            "cool_plate_temp": curProfile.cool_plate_temp[0],
            "cool_plate_temp_initial_layer": curProfile.cool_plate_temp_initial_layer[0],
            "cool_special_cds_fan_speed": "0",
            "default_filament_colour": "\"\"",
            "during_print_exhaust_fan_speed": curProfile.during_print_exhaust_fan_speed[0],
            "enable_overhang_bridge_fan": curProfile.enable_overhang_bridge_fan[0],
            "enable_pressure_advance": curProfile.enable_pressure_advance[0],
            "enable_special_area_additional_cooling_fan": "0",
            "eng_plate_temp": curProfile.eng_plate_temp[0],
            "eng_plate_temp_initial_layer": curProfile.eng_plate_temp_initial_layer[0],
            "epoxy_resin_plate_temp": "0",
            "epoxy_resin_plate_temp_initial_layer": "0",
            "fan_cooling_layer_time": curProfile.fan_cooling_layer_time[0],
            "fan_max_speed": curProfile.fan_max_speed[0],
            "fan_min_speed": curProfile.fan_min_speed[0],
            "filament_cooling_final_speed": curProfile.filament_cooling_final_speed[0],
            "filament_cooling_initial_speed": curProfile.filament_cooling_initial_speed[0],
            "filament_cooling_moves": curProfile.filament_cooling_moves[0],
            "filament_cost": curProfile.filament_cost[0],
            "filament_density": curProfile.filament_density[0],
            "filament_deretraction_speed": curProfile.filament_deretraction_speed[0],
            "filament_diameter": curProfile.filament_diameter[0],
            "filament_end_gcode": curProfile.filament_end_gcode[0],
            "filament_flow_ratio": curProfile.filament_flow_ratio[0],
            "filament_is_support": curProfile.filament_is_support[0],
            "filament_load_time": "0",
            "filament_loading_speed": curProfile.filament_loading_speed[0],
            "filament_loading_speed_start": curProfile.filament_loading_speed_start[0],
            "filament_max_volumetric_speed": curProfile.filament_max_volumetric_speed[0],
            "filament_minimal_purge_on_wipe_tower": curProfile.filament_minimal_purge_on_wipe_tower[0],
            "filament_multitool_ramming": curProfile.filament_multitool_ramming[0],
            "filament_multitool_ramming_flow": curProfile.filament_multitool_ramming_flow[0],
            "filament_multitool_ramming_volume": curProfile.filament_multitool_ramming_volume[0],
            "filament_notes": curProfile.filament_notes[0],
            "filament_ramming_parameters": curProfile.filament_ramming_parameters[0],
            "filament_retract_before_wipe": curProfile.filament_retract_before_wipe[0],
            "filament_retract_lift_above": curProfile.filament_retract_lift_above[0],
            "filament_retract_lift_below": curProfile.filament_retract_lift_below[0],
            "filament_retract_lift_enforce": curProfile.filament_retract_lift_enforce[0],
            "filament_retract_restart_extra": curProfile.filament_retract_restart_extra[0],
            "filament_retract_when_changing_layer": curProfile.filament_retract_when_changing_layer[0],
            "filament_retraction_length": curProfile.filament_retraction_length[0],
            "filament_retraction_minimum_travel": curProfile.filament_retraction_minimum_travel[0],
            "filament_retraction_speed": curProfile.filament_retraction_speed[0],
            "filament_shrink": curProfile.filament_shrink[0],
            "filament_soluble": curProfile.filament_soluble[0],
            "filament_start_gcode": curProfile.filament_start_gcode[0],
            "filament_toolchange_delay": curProfile.filament_toolchange_delay[0],
            "filament_type": curProfile.filament_type[0],
            "filament_unload_time": "0",
            "filament_unloading_speed": curProfile.filament_unloading_speed[0],
            "filament_unloading_speed_start": curProfile.filament_unloading_speed_start[0],
            "filament_vendor": curProfile.filament_vendor[0],
            "filament_wipe": curProfile.filament_wipe[0],
            "filament_wipe_distance": curProfile.filament_wipe_distance[0],
            "filament_z_hop": curProfile.filament_z_hop[0],
            "filament_z_hop_types": curProfile.filament_z_hop_types[0],
            "full_fan_speed_layer": curProfile.full_fan_speed_layer[0],
            "hot_plate_temp": curProfile.hot_plate_temp[0],
            "hot_plate_temp_initial_layer": curProfile.hot_plate_temp_initial_layer[0],
            "inherits": curProfile.inherits[0],
            "material_flow_dependent_temperature": "0",
            "material_flow_temp_graph": "",
            "nozzle_temperature": curProfile.nozzle_temperature[0],
            "nozzle_temperature_initial_layer": curProfile.nozzle_temperature_initial_layer[0],
            "nozzle_temperature_range_high": curProfile.nozzle_temperature_range_high[0],
            "nozzle_temperature_range_low": curProfile.nozzle_temperature_range_low[0],
            "overhang_fan_speed": curProfile.overhang_fan_speed[0],
            "overhang_fan_threshold": curProfile.overhang_fan_threshold[0],
            "pressure_advance": curProfile.pressure_advance[0],
            "reduce_fan_stop_start_freq": curProfile.reduce_fan_stop_start_freq[0],
            "required_nozzle_HRC": curProfile.required_nozzle_HRC[0],
            "slow_down_for_layer_cooling": curProfile.slow_down_for_layer_cooling[0],
            "slow_down_layer_time": curProfile.slow_down_layer_time[0],
            "slow_down_min_speed": curProfile.slow_down_min_speed[0],
            "support_material_interface_fan_speed": curProfile.support_material_interface_fan_speed[0],
            "temperature_vitrification": curProfile.temperature_vitrification[0],
            "textured_plate_temp": curProfile.textured_plate_temp[0],
            "textured_plate_temp_initial_layer": curProfile.textured_plate_temp_initial_layer[0]
        },
        "base": {
            "id": curProfileNotes.id,
            "brand": curProfileNotes.vendor || curProfile.filament_vendor[0],
            "name": curProfileNotes.name || curProfile.name[0],
            "meterialType": curProfileNotes.type || curProfile.filament_type[0],
            "colors": [
                "#ffffff"
            ],
            "density": curProfile.filament_density[0],
            "diameter": curProfile.filament_diameter[0],
            "costPerMeter": 0,
            "weightPerMeter": 0,
            "rank": 280,
            "minTemp": curProfile.nozzle_temperature_range_high[0],
            "maxTemp": curProfile.nozzle_temperature_range_low[0],
            "isSoluble": curProfile.filament_soluble[0] == 1 ? true : false,
            "isSupport": curProfile.filament_is_support[0] == 1 ? true : false,
            "shrinkageRate": 0,
            "softeningTemp": 0,
            "dryingTemp": 0,
            "dryingTime": 0
        }
    }
    return newObject
}

module.exports = {createProfile, deleteProfile, readProfile, updateProfiles, convertToPrinterFormat}