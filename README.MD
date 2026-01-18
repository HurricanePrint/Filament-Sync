## Donations
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P11AL9ZR)


# Filament Sync 

This tool reads custom filament profiles from Orcaslicer and Creality Print, converts them to Creality's database format and then sends them to the printer to pick manually with the screen or automatically with custom RFID tags

Creality has recently added syncing of your filaments with Creality Print in the latest K2 firmware, but this comes with some caveats. It will put all of your profiles under the "Generic" brand and does not allow the use of custom RFID tags. 

My tool will categorize your profiles under the correct brand name, filament type, and a more readable name. It also allows automatic assigning when using custom RFID tags with the CFS and side spool. Using custom RFID tags will also enable tracking filament usage and showing remaining amount on the filament selection screen.

### Creating custom filament presets

If you want to get your presets ready just copy your settings into a new custom filament profile

Right side of the Filament section 

Click "**Set filaments to use**" icon

Click "**Custom Filament**" at the top then click "**Create New**"

If you don't see this option on Creality Print, go into the options/preferences and set **User Role** to **Professional**

Select "**Copy Current Filament Preset**" and choose a generic profile 

You will need to add this into the Notes section of the filament

```
{"id":"","vendor":"","type":"","name":""}
```

The "id" should be a unique 5 digit value that you will also match with your custom RFID tags if you are using them

You can ⌘/CTRL-F in the material_database.json to make sure the id you pick isn't already being used

An id is still required even if you are not using RFID tags as the tool searches by id when updating filament settings

Here is an example

```
{"id":"02345","vendor":"ELEGOO","type":"PLA","name":"Fast PLA"}
```

Use the advanced mode to set the id you picked as "Material Code" in the RFID for CFS app

## Prerequisites

#### Install Node.js

>[Download Node.js](https://nodejs.org/en)

## Installation

#### Download Filament-Sync

[Latest release](https://github.com/hurricaneprint/Filament-Sync/releases/latest)

Extract the folder on your computer

If you haven't already connected to your printer with SSH, use terminal or powershell to connect and generate the RSA keys needed for the script to run correctly

### Check the troubleshooting section before modifying paths in the scripts

## Config

Open the **user-config.js** file with a text editor

Change **PRINTERIP** to the ip of your printer

```
const PRINTERIP = '127.0.0.1'
const USER = 'root'
const PASSWORD = 'creality_2024'
```
If you have changed your username or password they can also be updated here

Change **SLICER** to select the slicer you want to sync from 

* Enter 'orca' or 'creality'

```
const SLICER = 'orca'
```

If you are using logged into an account in OrcaSlicer or CrealityPrint, change **USERID** to the unique id number that the slicer has set for the user folder.

```
const USERID = 'default'
```

You can find your user id by clicking the **Help** tab in your slicer and then clicking **Show Configuration Folder**

OrcaSlicer

    Mac: /Library/Application Support/OrcaSlicer/user/USERID#
    Linux: /.config/OrcaSlicerOrcaSlicer/user/USERID#
    Windows: /AppData/Roaming/OrcaSlicer/user/USERID#

CrealityPrint

    Mac: /Library/Application Support/Creality/Creality Print/6.0/user/USERID#
    Linux: /.config/Creality/Creality Print/6.0/user/USERID#
    Windows: /AppData/Roaming/Creality/Creality Print/6.0/user/USERID#

## Set to run as post-processing script in slicer

This will sync everytime you slice and export gcode to the printer

You may encounter an error the first time it runs the script. This is normal as the service is being installed to the printer and sometimes the slicer loses its connection. It should work normally every time after this.

At the bottom of the "**Others**" tab of your slicing settings, find "**Post-processing Scripts**" 

Make sure to change the path to where you put the extracted Filament-Sync folder

### Mac 

```
/usr/local/bin/node /Users/your-user-name/Filament-Sync/main.js;
```

### Linux

```
/usr/local/bin/node /home/your-user-name/Filament-Sync/main.js;
```

#### Windows

```
C:\Users\your-user-name\Filament-Sync\windows-sync.bat;
```

### To sync manually

In Terminal/Powershell enter the Filament-Sync folder
then run
```
node main.js
```

Windows users can also run the windows-sync.bat file 

## Troubleshooting

### Do not remove /base from the slicer profile path
This has been reported several times. The /base folder contains fully custom profiles, the preceeding folder does not. If your profiles are not in the /base folder, you are not creating them correctly. See the directions above for the correct procedure. The profiles outside of the /base folder do not contain all the needed parameters.

### If the printer fails to start prints and shows a EEPROM_DEBUG error

Go into the folder where your presets are stored and make sure that the preset json files show all of the filament settings and not just a short list of the ones that you edited. If the custom profile wasn't created correctly it won't show all of the settings. The full list should be around 300 lines.

### If running as post-processing script and it isn't syncing correctly

Run the script manually in the terminal and refer to the error messages in the console to see what needs to be fixed.

If the error fix isn't described, create a [New Issue](https://github.com/HurricanePrint/Filament-Sync/issues/new/choose) and copy & paste the terminal output. 
