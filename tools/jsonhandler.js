const fs = require('fs')

const convertSlicerFormat = (preset) => {
    let presetNotes = preset.filament_notes[0]
    for (value in preset) {
        if(Array.isArray(preset[value])) {
            preset[value] = preset[value][0]
        }
        else {
            preset[value] = preset[value]
        }
    }
    preset.filament_notes = JSON.parse(presetNotes)
    return preset
}

const convertToPrinterFormat = (preset) => {
    let newPreset
    let presetNotes
    newPreset = convertSlicerFormat(preset)
    presetNotes = preset.filament_notes
    let newObject = {
        "engineVersion": "3.0.0",
        "printerIntName": "F008",
        "nozzleDiameter": ["0.4"],
        "kvParam": {
            "activate_air_filtration": "",
            "activate_chamber_temp_control": "",
            "additional_cooling_fan_speed": "",
            "chamber_temperature": "",
            "close_fan_the_first_x_layers": "",
            "compatible_printers": "",
            "compatible_printers_condition": "",
            "compatible_prints": "",
            "compatible_prints_condition": "",
            "complete_print_exhaust_fan_speed": "",
            "cool_cds_fan_start_at_height": "0.5",
            "cool_plate_temp": "",
            "cool_plate_temp_initial_layer": "",
            "cool_special_cds_fan_speed": "0",
            "default_filament_colour": "\"\"",
            "during_print_exhaust_fan_speed": "",
            "enable_overhang_bridge_fan": "",
            "enable_pressure_advance": "",
            "enable_special_area_additional_cooling_fan": "0",
            "eng_plate_temp": "",
            "eng_plate_temp_initial_layer": "",
            "epoxy_resin_plate_temp": "0",
            "epoxy_resin_plate_temp_initial_layer": "0",
            "fan_cooling_layer_time": "",
            "fan_max_speed": "",
            "fan_min_speed": "",
            "filament_cooling_final_speed": "",
            "filament_cooling_initial_speed": "",
            "filament_cooling_moves": "",
            "filament_cost": "",
            "filament_density": "",
            "filament_deretraction_speed": "",
            "filament_diameter": "",
            "filament_end_gcode": "",
            "filament_flow_ratio": "",
            "filament_is_support": "",
            "filament_load_time": "0",
            "filament_loading_speed": "",
            "filament_loading_speed_start": "",
            "filament_max_volumetric_speed": "",
            "filament_minimal_purge_on_wipe_tower": "",
            "filament_multitool_ramming": "",
            "filament_multitool_ramming_flow": "",
            "filament_multitool_ramming_volume": "",
            "filament_notes": "",
            "filament_ramming_parameters": "",
            "filament_retract_before_wipe": "",
            "filament_retract_lift_above": "",
            "filament_retract_lift_below": "",
            "filament_retract_lift_enforce": "",
            "filament_retract_restart_extra": "",
            "filament_retract_when_changing_layer": "",
            "filament_retraction_length": "",
            "filament_retraction_minimum_travel": "",
            "filament_retraction_speed": "",
            "filament_shrink": "",
            "filament_soluble": "",
            "filament_start_gcode": "",
            "filament_toolchange_delay": "",
            "filament_type": "",
            "filament_unload_time": "0",
            "filament_unloading_speed": "",
            "filament_unloading_speed_start": "",
            "filament_vendor": "",
            "filament_wipe": "",
            "filament_wipe_distance": "",
            "filament_z_hop": "",
            "filament_z_hop_types": "",
            "full_fan_speed_layer": "",
            "hot_plate_temp": "",
            "hot_plate_temp_initial_layer": "",
            "inherits": "",
            "material_flow_dependent_temperature": "0",
            "material_flow_temp_graph": "",
            "nozzle_temperature": "",
            "nozzle_temperature_initial_layer": "",
            "nozzle_temperature_range_high": "",
            "nozzle_temperature_range_low": "",
            "overhang_fan_speed": "",
            "overhang_fan_threshold": "",
            "pressure_advance": "",
            "reduce_fan_stop_start_freq": "",
            "required_nozzle_HRC": "",
            "slow_down_for_layer_cooling": "",
            "slow_down_layer_time": "",
            "slow_down_min_speed": "",
            "support_material_interface_fan_speed": "",
            "temperature_vitrification": "",
            "textured_plate_temp": "",
            "textured_plate_temp_initial_layer": ""
        },
        "base": {
            "id": presetNotes.id,
            "brand": presetNotes.vendor || preset.filament_vendor,
            "name": presetNotes.name || preset.name,
            "meterialType": presetNotes.type || preset.filament_type,
            "colors": [
                "#ffffff"
            ],
            "density": Number(preset.filament_density),
            "diameter": preset.filament_diameter,
            "costPerMeter": 0,
            "weightPerMeter": 0,
            "rank": 10000,
            "minTemp": Number(preset.nozzle_temperature_range_low),
            "maxTemp": Number(preset.nozzle_temperature_range_high),
            "isSoluble": preset.filament_soluble == 1 ? true : false,
            "isSupport": preset.filament_is_support == 1 ? true : false,
            "shrinkageRate": 0,
            "softeningTemp": 0,
            "dryingTemp": 0,
            "dryingTime": 0
        }
    }
    let kvParam = newObject.kvParam
    for (item in kvParam) {
        kvParam[item] = preset[item]
        if (kvParam[item] == undefined) kvParam[item] = ""
    }
    newObject.kvParam = kvParam
    return newObject
}

module.exports = convertToPrinterFormat