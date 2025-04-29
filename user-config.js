const PRINTERIP = '127.0.0.1'
const USER = 'root'
const PASSWORD = 'creality_2024'

// Users logged into creality cloud will need to specify their unique user folder id
// replace default below with the id from 
// Mac: /Library/Application Support/Creality/Creality Print/6.0/user/UNIQUEID#
// Linux: /.config/Creality/Creality Print/6.0/user/UNIQUEID#
// Windows: /AppData/Roaming/Creality/Creality Print/6.0/user/UNIQUEID#
const CCUSERID = 'default'

module.exports = {PRINTERIP, USER, PASSWORD, CCUSERID}