/*
Enter the slicer you want to sync from 'orca' or 'creality'
*/
const SLICER = 'orca'

/*
Users logged into the slicer will need to specify their unique user folder id
replace default below with the id from:

OrcaSlicer
    Mac: /Library/Application Support/OrcaSlicer/user/USERID#
    Linux: /.config/OrcaSlicerOrcaSlicer/user/USERID#
    Windows: /AppData/Roaming/OrcaSlicer/user/USERID#

CrealityPrint
    Mac: /Library/Application Support/Creality/Creality Print/6.0/user/USERID#
    Linux: /.config/Creality/Creality Print/6.0/user/USERID#
    Windows: /AppData/Roaming/Creality/Creality Print/6.0/user/USERID#

Not logged in: 'default'
*/
const USERID = 'default'


/*
Supports syncing to multiple printers
Remove the // from the lines below to add more
If the printers share username or password you can reuse the variables below or enter individually
*/
const USER = 'root'
const PASSWORD = 'creality_2024'

/*
Set k1: true if you are using a K1 printer
*/
const PRINTERS = [
  { name: "Printer1", ip: "10.0.0.50", user: USER, pass: PASSWORD, k1: false },
  //{ name: "Printer2", ip: "10.0.0.51", user: "user", pass: "pass" },
  //{ name: "Printer3", ip: "10.0.0.52", user: "user2", pass: "pass2" },

]

module.exports = {PRINTERS, SLICER, USERID}