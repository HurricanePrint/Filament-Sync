const {Client} = require('node-scp')
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERIP, USER, PASSWORD} = require(dirname + '/user-config.js')
const remoteDir = '/usr/share/Filament-Sync'
const localDataDir = dirname + '/data'

const sendFiles = () => {
    Client({
        host: PRINTERIP,
        port: 22,
        username: USER,
        password: PASSWORD,
    }).then(client => {
        client.uploadDir(localDataDir, remoteDir)
            .then(response => {
                client.close() 
        }).catch(error => {
            console.error('\nCheck user-config.js to make sure printer info is set correctly\n')
            console.error(error)
        })
    })
}
sendFiles()
 
module.exports = {sendFiles}