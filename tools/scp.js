const fs = require('fs')
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERS} = require(dirname + '/user-config.js')
const printerClients = {}
const { Client } = require('ssh2')
const remoteDir = '/mnt/UDISK/printer_data/config/Filament-Sync-Service/data'
const localDataDir = dirname + '/data'
const filesToUpload = ['material_database.json', 'material_option.json']

const generatePrinterClients = () => {
    for(let printer of PRINTERS) {
        let printerKey = `${printer.name}Client`
        printerClients[printerKey] = new Client()
        printerClients[printerKey].config = {
            host: printer.ip,
            port: 22,
            username: printer.user,
            password: printer.pass,
            readyTimeout: 5000
        }
    }
}   

const uploadSingleFile = (stream, localPath, fileName) => {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(localPath)) {
                return reject(new Error(`Local file asset not found: ${localPath}`))
            }

            const stats = fs.statSync(localPath)
            
            stream.write(`C0644 ${stats.size} ${fileName}\n`)
            
            stream.once('data', (data) => {
                if (data[0] !== 0x00) {
                    return reject(new Error(`Server rejected file header for ${fileName}: ${data.toString()}`))
                }
                const readStream = fs.createReadStream(localPath)
                readStream.on('error', (fsErr) => reject(new Error(`Local I/O Error: ${fsErr.message}`)))
                
                readStream.pipe(stream, { end: false })
                
                readStream.on('end', () => {
                    stream.write('\x00')      
                    stream.once('data', (ack) => {
                        if (ack[0] === 0x00) {
                            resolve()
                        } else {
                            reject(new Error(`Protocol failure terminating stream for ${fileName}`))
                        }
                    })
                })
            })
        } catch (err) {
            reject(err)
        }
    })
}

const syncSinglePrinter = (clientKey, clientInstance) => {
    return new Promise((resolve, reject) => {
        clientInstance.on('error', (connErr) => {
            reject(new Error(`Connection failed: ${connErr.message}`))
        })

        clientInstance.on('ready', () => {
            clientInstance.exec(`scp -t ${remoteDir}`, async (err, stream) => {
                try {
                    if (err) throw new Error(`SSH Command Execution Failure: ${err.message}`)

                    for (const fileName of filesToUpload) {
                        const localPath = path.join(localDataDir, fileName)
                        
                        await uploadSingleFile(stream, localPath, fileName)
                    }

                    console.log(`[${clientKey}] profiles synced successfully.`)
                    resolve()
                } catch (pipelineError) {
                    reject(pipelineError)
                } finally {
                    if (stream) stream.end()
                    clientInstance.end()
                }
            })
        })

        clientInstance.connect(clientInstance.config)
    })
}

const sendToPrinter = async () => {
    generatePrinterClients()
    const clientKeys = Object.keys(printerClients)

    const syncPromises = clientKeys.map(clientKey => 
        syncSinglePrinter(clientKey, printerClients[clientKey])
    )
    const results = await Promise.allSettled(syncPromises)

    let successes = 0
    let failures = 0

    results.forEach((result, idx) => {
        const targetLabel = clientKeys[idx]
        if (result.status === 'fulfilled') {
            successes++
        } else {
            console.error(`[${targetLabel}] sync failed -> ${result.reason.message}`)
            failures++
        }
    })

    console.log(`\nSync Summary: ${successes} printer synced, ${failures} printers skipped`)
    if (successes === 0 && clientKeys.length > 0) {
        process.exit(1)
    }
}

 
module.exports = sendToPrinter