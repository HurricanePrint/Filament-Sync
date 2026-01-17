const { rejects } = require('assert/strict')
const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERIP, USER, PASSWORD} = require(dirname + '/user-config.js')
const remoteDir = '/mnt/UDISK/printer_data/config/Filament-Sync-Service/data'
const localDataDir = dirname + '/data'
const { Client } = require('ssh2')

const client = new Client()
const config = {
  host: PRINTERIP,
  port: 22,
  username: USER,
  password: PASSWORD
}

const filesToUpload = ['material_database.json', 'material_option.json']

const sendToPrinter = () => {
    client.on('ready', () => {
        client.exec(`scp -t ${remoteDir}`, (err, stream) => {
            if (err) throw err
            let fileIndex = 0

            const sendNextFile = () => {
                if (fileIndex >= filesToUpload.length) {
                    stream.end()
                    client.end()
                    return
                }
                console.log("sending ", filesToUpload[fileIndex])
                const fileName = filesToUpload[fileIndex]
                const localPath = path.join(localDataDir, fileName)
                
                if (!fs.existsSync(localPath)) {
                    console.error(`Files not found: ${localPath}`)
                    client.end()
                }
                const stats = fs.statSync(localPath)
                stream.write(`C0644 ${stats.size} ${fileName}\n`)
                stream.once('data', (data) => {
                    if (data[0] !== 0x00) {
                        console.error(`Server rejected metadata for ${fileName}:`, data.toString())
                        return
                    }
                    const readStream = fs.createReadStream(localPath)
                    readStream.pipe(stream, { end: false })
                    readStream.on('end', () => {
                        stream.write('\x00')
                        stream.once('data', (ack) => {
                            if (ack[0] === 0x00) {
                                fileIndex++
                                sendNextFile()
                            } else {
                                console.error(`Error finishing transfer for ${fileName}`)
                            }
                        })
                    })
                })
            }
            sendNextFile()
        })
    }).connect(config)
}
 
module.exports = sendToPrinter