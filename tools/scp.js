const { execFile } = require('child_process')
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERIP, USER, PASSWORD} = require(dirname + '/user-config.js')
const remoteDir = '/mnt/UDISK/printer_data/config/Filament-Sync-Service/data'
const localDataDir = dirname + '/data'

const sendToPrinter = () => {
    const args = [
        '-O',
        '-r',
        localDataDir + '/',
        `${USER}@${PRINTERIP}:${remoteDir}/`
    ]

    execFile('scp', args, (error, stdout, stderr) => {
        if (error) {
            console.error('SCP failed')
            console.error(stderr)
            return
        }
        console.log('Filament data uploaded successfully')
    })
}
 
module.exports = sendToPrinter