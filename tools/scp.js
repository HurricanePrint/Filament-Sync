const {Client} = require('node-scp')
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERIP, USER, PASSWORD} = require(dirname + '/network-config.js')
const remoteFileDir = '/root/Filament-Sync-Service/data'
const localDataDir = dirname + '/data'


const sendFiles = () => {
    Client({
        host: PRINTERIP,
        port: 22,
        username: USER,
        password: PASSWORD,
    }).then(client => {
        client.uploadDir(localDataDir, remoteFileDir)
            .then(response => {
                client.close() 
            })
            .catch(error => {})
    }).catch(e => console.log(e))
}

module.exports = {sendFiles}