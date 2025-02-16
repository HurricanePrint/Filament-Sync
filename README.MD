

# Filament Sync 
This is the tool that reads the profiles from Orcaslicer, converts them to creality's database format and sends them to the printer.

When used with [Filament-Sync-Service](https://github.com/HurricanePrint/Filament-Sync-Service) installed on your printer, your profiles are automatically synced to work with custom rfid tags.

#### Creating custom filament presets

It's only working with custom profiles from Orcaslicer at the moment. Creality doesn't allow you to make custom profiles for some stupid reason.

If you want to get your presets ready just copy your settings into a new custom filament profile

Right side of the Filament section 
Click "Set filaments to use"
Click "Custom Filament" at the top then click "Create New"
You will need to add this into the Notes section of the filament

```
{"id":"","vendor":"","type":"","name":""}
```

Here is an example

```
{"id":"02345","vendor":"Elegoo","type":"PLA","name":"Fast PLA"}

```
The "id" should be a 5 digit value that you will 
also match with your custom RFID tags. 

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P11AL9ZR)

## Prerequisites

#### Install Filament-Sync-Service to printer

>[Filament-Sync-Service](https://github.com/HurricanePrint/Filament-Sync-Service)

#### Install git if you are running Windows

In Terminal:

    winget install --id Git.Git -e --source winget

#### Install Node.js


>[Download Node.js](https://nodejs.org/en)


#### For Windows:

Running scripts is disabled by default. To enable them, open terminal and run

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

Open the network-config.js file with a text editor.

Change PRINTERIP to the ip of your printer and save

    const PRINTERIP = '127.0.0.1'
    const USER = 'root'
    const PASSWORD = 'creality_2024'

If you have changed your username or password they can also be updated here.

## Run as post-processing script in slicer

This will sync everytime you slice and export gcode to the printer.

At the bottom of the "Others" tab of your slicing settings, find "Post-processing Scripts" 

#### Windows

Replace "your-user-name" with your user folder name

```
C:\Users\your-user-name\Filament-Sync\windows-sync.bat;
```

### Mac 

Replace "your-user-name" with your user folder name

```
/usr/local/bin/node /Users/your-user-name/Filament-Sync/main.js;
```

### Linux

Replace "your-user-name" with your user folder name

```
/usr/local/bin/node /home/your-user-name/Filament-Sync/main.js;
```

## To sync manually

Open Terminal and enter the Filament-Sync folder

#### Windows 

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
#### Mac & Linux

```
cd Filament-Sync
```

```
node main.js
```

## Updating

Remove the old folder either manually in explorer/finder

or 

```
rm -rf Filament-Sync
```

Reclone the repo

```
git clone https://github.com/HurricanePrint/Filament-Sync.git
```

```
cd Filament-Sync
```

```
npm i
```

Add your printers ip in the network-config.js file