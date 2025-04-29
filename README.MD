# Filament Sync 
This tool reads custom filament profiles from Orcaslicer and Creality Print, converts them to Creality's database format and then sends them to the printer to pick manually with the screen or automatically with custom RFID tags

Use with [Filament-Sync-Service](https://github.com/HurricanePrint/Filament-Sync-Service) installed on your printer

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P11AL9ZR)

### Creating custom filament presets

If you want to get your presets ready just copy your settings into a new custom filament profile

Right side of the Filament section 

Click "**Set filaments to use**"

Click "**Custom Filament**" at the top then click "**Create New**"

If you don't see this option on Creality Print, go into the options/preferences and set **User Role** to **Professional**

You will need to add this into the Notes section of the filament

```
{"id":"","vendor":"","type":"","name":""}
```

The "id" should be a unique 5 digit value that you will also match with your custom RFID tags if you are using them

An id is still required even if you are not using RFID tags as the tool searches by id when updating filament settings

Here is an example

```
{"id":"02345","vendor":"Elegoo","type":"PLA","name":"Fast PLA"}
```

## Prerequisites

#### Install Filament-Sync-Service on your printer

>[Filament-Sync-Service](https://github.com/HurricanePrint/Filament-Sync-Service)

#### Install git if you are running Windows

In Terminal:

    winget install --id Git.Git -e --source winget

#### Install Node.js


>[Download Node.js](https://nodejs.org/en)


#### For Windows:

Running scripts is disabled by default

 To enable them, open terminal and run

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Installation

#### Clone this repo into your user folder

```
cd ~/
```
    git clone https://github.com/HurricanePrint/Filament-Sync.git

```
cd Filament-Sync/
```

```
npm install
```

## Config

Open the **user-config.js** file with a text editor

Change **PRINTERIP** to the ip of your printer and save

    const PRINTERIP = '127.0.0.1'
    const USER = 'root'
    const PASSWORD = 'creality_2024'

If you have changed your username or password they can also be updated here

If you are using CrealityPrint and have logged into your cloud account

Change **CCUSERID** to the unique id number that creality has set for the user folder.

Where to find it

Mac: `/Library/Application Support/Creality/Creality Print/6.0/user/`

Linux: `/.config/Creality/Creality Print/6.0/user/`

Windows: `/AppData/Roaming/Creality/Creality Print/6.0/user/`



## Run as post-processing script in slicer

This will sync everytime you slice and export gcode to the printer

At the bottom of the "**Others**" tab of your slicing settings, find "**Post-processing Scripts**" 

### Mac 

Replace "**your-user-name**" with your user folder name

```
/usr/local/bin/node /Users/your-user-name/Filament-Sync/main.js;
```

### Linux

Replace "**your-user-name**" with your user folder name

```
/usr/local/bin/node /home/your-user-name/Filament-Sync/main.js;
```

#### Windows

Replace "**your-user-name**" with your user folder name

```
C:\Users\your-user-name\Filament-Sync\windows-sync.bat;
```

## To sync manually


#### Mac & Linux

```
cd Filament-Sync
```

```
node main.js
```

#### Windows 

In File Explorer

Double-click the batch file in the Filament-Sync directory

```
windows-sync.bat
```

Or from the terminal

```
cd .\Filament-Sync\
```

```
node main.js
```

## Updating

Open Terminal and enter the Filament Sync directory

```
cd Filament-Sync
```

Pull the new changes

```
git fetch --all
```

```
git reset --hard origin/main 
```

```
npm i
```

Make sure your settings are correct in user-config.js 

## Troubleshooting

If running as post-processing script and it isn't syncing correctly. Run the script manually in the terminal and refer to the error messages in the console to see what needs to be fixed.

If the error fix isn't described, create a [New Issue](https://github.com/HurricanePrint/Filament-Sync/issues/new/choose) and copy & paste the terminal output. 
