## Donations
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P11AL9ZR)


# Filament Sync

Compatible with K2 and Hi series printers

This tool reads custom filament profiles from Orcaslicer and Creality Print, converts them to Creality's database format and then sends them to the printer to pick manually with the screen or automatically with custom RFID tags

Creality has recently added syncing of your filaments with Creality Print, but this comes with some caveats. It will put all of your profiles under the "Generic" brand and does not allow the use of custom RFID tags. It requires creating a cloud account which also collects telemetrics and print data which can be a privacy/security risk for some users and organizations. 

My tool will categorize your profiles under the correct brand name, filament type, and a more readable name. It also allows automatic assigning when using custom RFID tags with the CFS and side spool. Using custom RFID tags will also enable tracking filament usage and showing remaining amount on the filament selection screen.

### Add required info to your profiles

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

### If you are using custom RFID tags
Set the "Material Code" to the id that you set in the profile.
In the RFID for CFS app, turn on advanced mode to enable setting custom codes

## Prerequisites

#### Install Node.js

>[Download Node.js](https://nodejs.org/en)

#### Windows

Git needs to be installed on windows
>[Download Git](https://git-scm.com/install/windows)

## Installation

#### Download Filament-Sync

[Latest release](https://github.com/hurricaneprint/Filament-Sync/releases/latest)

Extract the folder on your computer

#### If you haven't already connected to your printer with SSH, use terminal or powershell to connect and generate the RSA keys needed for the script to run correctly

```
ssh root@your-printer-ip
```
Check the enable root menu on your printer for the password. K2 Plus uses ```creality_2024```, Hi uses ```Creality2024```

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
    Flatpak: /.var/app/io.github.softfever.OrcaSlicer/config/OrcaSlicer/user/
    Windows: /AppData/Roaming/OrcaSlicer/user/USERID#

CrealityPrint

    Mac: /Library/Application Support/Creality/Creality Print/7.0/user/USERID#
    Linux: /.config/Creality/Creality Print/7.0/user/USERID#
    Flatpak: /.var/app/io.github.crealityofficial.CrealityPrint/config/Creality/Creality Print/7.0/user/
    Windows: /AppData/Roaming/Creality/Creality Print/7.0/user/USERID#

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

### Creating custom filament presets(Recommended, but no longer required)

If you want to get your presets ready just copy your settings into a new custom filament profile

Right side of the Filament section 

Click "**Set filaments to use**" icon

Click "**Custom Filament**" at the top then click "**Create New**"

If you don't see this option on Creality Print, go into the options/preferences and set **User Role** to **Professional**

Select "**Copy Current Filament Preset**" and choose a generic profile 

## Troubleshooting

### If running as post-processing script and it isn't syncing correctly

Run the script manually in the terminal and refer to the error messages in the console to see what needs to be fixed.

If the error fix isn't described, create a [New Issue](https://github.com/HurricanePrint/Filament-Sync/issues/new/choose) and include the terminal output. 
