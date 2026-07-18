# Filament Sync


> **Compatibility:** K2 and Hi series printers

This tool reads custom filament profiles from **Orcaslicer** and **Creality Print**, converts them to Creality's database format, and sends them to the printer. This allows you to pick them manually on the screen or automatically using custom RFID tags.

---

## 📖 Table of Contents
* [✨ Features & Benefits](#-features--benefits)
* [🛠️ Prerequisites](#️-prerequisites)
    * [Connect to your printer](#1-connect-to-your-printer-with-ssh)
    * [NodeJS](#2-all-operating-systems-require-nodejs)
    * [Windows](#windows)
    * [Mac](#mac)
    * [Linux](#linux)
* [📦 Installation](#-installation)
* [💻 Slicer and RFID Configuration](#-slicer-configuration)
    * [1. Add required info to your profiles](#1-add-required-info-to-your-profiles)
    * [2. If you are using custom RFID tags](#2-if-you-are-using-custom-rfid-tags)
* [🔧 Tool Configuration](#-tool-configuration)
    * [1. Pick Slicer](#1-change-slicer-to-select-the-slicer-you-want-to-sync-from-)
    * [2. Slicer UserID](#2-set-your-slicer-userid)
    * [3. Select Printers](#3-setup-your-printers)
* [🔄 Syncing](#-syncing)
    * [Manual Sync](#to-sync-manually)
    * [Automatic Sync](#to-sync-automatically)
* [☕ Donations](#-donations)

---

## ✨ Features & Benefits

Creality recently added filament syncing with Creality Print, but it has some major limitations. **Filament Sync** fixes these issues:

| Feature | Creality Print Sync | Filament Sync (This Tool) |
| :--- | :---: | :---: |
| **Profile Categorization** | Forces everything under "Generic" | Organizes by correct Brand, Type, and Name |
| **Custom RFID Tags** | ❌ Not supported |  Supported (CFS & Side Spool) |
| **Filament Tracking** | ❌ Not supported |  Tracks usage & displays remaining amount |
| **Privacy & Security** | ⚠️ Requires cloud account & data collection |  100% Local / Private |

---

## 🛠️ Prerequisites

### 1. Connect to your printer with SSH

You may need to enable root access in the settings on your printer. Once enabled it will show the default username and password.

If you haven't already connected to your printer with SSH at least once, use terminal or powershell to connect and generate the RSA keys needed for the script to run correctly

```
ssh root@your-printer-ip
```

### 2. All operating systems require **Node.js**. 

Download it from the official site:
[Download Node.js](https://nodejs.org)

### 3. Install git

#### Windows
* **Git** must be installed on your system.
* [Download Git for Windows](https://git-scm.com)

#### Mac
* **Git** is usually installed by default. You can check by running `git --version` in your terminal.

If you do not have Git installed, you will need **Homebrew** installed first to manage dependencies, use the official installation script from [Brew.sh](https://brew.sh/):
  ```bash
  /bin/bash -c "\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  ```
  Then run `brew install git`.

#### Linux
* **Git** is usually installed by default. You can check by running `git --version` in your terminal.

If you do not have Git installed
* **Ubuntu/Debian:** `sudo apt install git`
* **Fedora:** `sudo dnf install git`
* **Arch:** `sudo pacman -S git`

---

## 📦 Installation

#### Simple
Download the [Latest release](https://github.com/hurricaneprint/Filament-Sync/releases/latest) 

Extract the folder


*If you clone the repo instead of downloading the latest release, you will need to run* ```npm i``` *to install the required submodules.*

---

## 💻 Slicer Configuration

### 1. Add required info to your profiles
You must add a JSON metadata string into the **Notes** section of your filament profile in Orcaslicer or Creality Print.

Copy and paste this template into your profile notes:
```json
{"id":"","vendor":"","type":"","name":""}
```

#### Important Rules for IDs:
* The `"id"` must be a **unique 5-digit value**. 
* If you are using custom RFID tags, this ID must match the tag.
* ⚠️ **An ID is required** even if you don't use RFID tags, as the tool uses it to update printer settings.

**Example configuration:**
```json
{"id":"02345","vendor":"ELEGOO","type":"PLA","name":"Fast PLA"}
```

### 2. If you are using custom RFID tags
1. Set the **Material Code** in your RFID app to the exact `id` you specified in your profile notes.
2. In the *RFID for CFS* app, enable **Advanced Mode** to unlock custom code settings.

---

## 🔧 Tool Configuration

Open the **user-config.js** file with a text editor

### 1. Change **SLICER** to select the slicer you want to sync from .

* Enter 'orca' or 'creality'

```
const SLICER = 'orca'
```

### 2. Set your slicer userid
If you are using logged into a cloud account in OrcaSlicer or CrealityPrint, change **USERID** to the unique id number that the slicer has set for the user folder.

```
const USERID = 'default'
```

You can find your user id by clicking the **Help** tab in your slicer and then clicking **Show Configuration Folder**.

OrcaSlicer

    Windows: /AppData/Roaming/OrcaSlicer/user/USERID#
    Mac: /Library/Application Support/OrcaSlicer/user/USERID#
    Linux: /.config/OrcaSlicerOrcaSlicer/user/USERID#
    Flatpak: /.var/app/io.github.softfever.OrcaSlicer/config/OrcaSlicer/user/

CrealityPrint

    Windows: /AppData/Roaming/Creality/Creality Print/7.0/user/USERID#
    Mac: /Library/Application Support/Creality/Creality Print/7.0/user/USERID#
    Linux: /.config/Creality/Creality Print/7.0/user/USERID#
    Flatpak: /.var/app/io.github.crealityofficial.CrealityPrint/config/Creality/Creality Print/7.0/user/

### 3. Setup your printers

Supports syncing to one or multiple printers.

If the printers share username or password you can reuse the variables below or enter individually in the ``PRINTERS`` list
```
const USER = 'root'
const PASSWORD = 'creality_2024'
```
```
const PRINTERS = [
  { name: "Printer1", ip: "10.0.0.50", user: USER, pass: PASSWORD },
  //{ name: "Printer2", ip: "10.0.0.51", user: "user", pass: "pass" },
  //{ name: "Printer3", ip: "10.0.0.52", user: "user2", pass: "pass2" },
]
```
To add more printers to the list remove the comment ``//`` from the lines. You can also add more printers by pasting the following line
```
{ name: "OfficePrinter", ip: "192.168.1.150", user: "user", pass: "pass" },
```

---

## 🔄 Syncing

It is suggested to run the script manually the first time as the slicer may encounter an error the first time it runs the script as a Post-Process Script. Running it manually will also allow you to see if there are any installation or syncing errors.

### To sync manually

In Terminal/Powershell enter the Filament-Sync folder
then run
```
node main.js
```

### To sync automatically

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

## ☕ Donations

If this tool saved you from cloud account hassles or helped organize your workshop, consider supporting the project!

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P11AL9ZR)
