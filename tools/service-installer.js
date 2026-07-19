const { execSync } = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')
const { Client } = require('ssh2')

const repoUrl = "https://github.com/HurricanePrint/Filament-Sync-Service.git"
const remotePath = "/mnt/UDISK/printer_data/config/Filament-Sync-Service"
const mainDir = path.join(__dirname, '..')
const toolsDir = __dirname

const { PRINTERS } = require(path.join(mainDir, 'user-config.js'))

const prepareLocalArchivePackage = () => {
    const persistentTarPath = path.join(toolsDir, 'service.tar')

    if (fs.existsSync(persistentTarPath)) {
        console.log('Found local service.tar')
        const stats = fs.statSync(persistentTarPath)
        return { 
            tmpDir: null, 
            tarPath: persistentTarPath, 
            archiveSize: stats.size 
        }
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-transfer-'))
    const localRepoPath = path.join(tmpDir, 'cloned_repo')
    const tarPath = path.join(toolsDir, 'service.tar')

    try {
        console.log('Cloning repository')
        execSync(`git clone ${repoUrl} ${localRepoPath}`, { stdio: 'ignore' })

        console.log('Creating installation archive')
        execSync(`tar -cf ${tarPath} -C ${localRepoPath} .`)
        const stats = fs.statSync(tarPath)
        return { tmpDir, tarPath, archiveSize: stats.size }
    } catch (archiveError) {
        if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true, force: true })
        throw new Error(`Failed to compile local asset package: ${archiveError.message}`)
    }
}

const executeRemoteInstallationPipeline = (printer, tarPath, archiveSize) => {
    return new Promise((resolve, reject) => {
        const client = new Client()
        const config = {
            host: printer.ip,
            port: 22,
            username: printer.user,
            password: printer.pass,
            readyTimeout: 10000
        }

        client.on('error', (err) => reject(new Error(`SSH Connection failure: ${err.message}`)))

        client.on('ready', () => {
            console.log(`[${printer.name}] Connected and Initializing directories`)
            
            client.exec(`mkdir -p ${remotePath} && scp -t ${remotePath}`, (err, stream) => {
                if (err) {
                    client.end()
                    return reject(err)
                }

                stream.write(`C0644 ${archiveSize} service.tar\n`)
                
                stream.once('data', (data) => {
                    if (data[0] !== 0x00) {
                        client.end()
                        return reject(new Error('SCP handshaking execution rejected by remote device'))
                    }

                    const readStream = fs.createReadStream(tarPath)
                    readStream.pipe(stream, { end: false })

                    readStream.on('end', () => {
                        stream.write('\x00')
                        
                        stream.once('data', (ack) => {
                            if (ack[0] !== 0x00) {
                                client.end()
                                return reject(new Error('SCP packet transfer confirmation dropped'))
                            }
                            stream.end()

                            console.log(`[${printer.name}] Extracting files and starting service`)
                            const baseCmd = `cd ${remotePath} && tar -xf service.tar && rm service.tar`;
                            const remoteCmd = printer.k1 
                                ? `${baseCmd} && git checkout k1-test && sh install.sh k1` 
                                : `${baseCmd} && sh install.sh`;
                            
                            client.exec(remoteCmd, (err, installStream) => {
                                if (err) {
                                    client.end()
                                    return reject(err)
                                }
                                
                                installStream.on('close', (code) => {
                                    client.end()
                                    if (code === 0) {
                                        resolve()
                                    } else {
                                        reject(new Error(`Install scripts exited with error flag code: ${code}`))
                                    }
                                })
                                installStream.resume()
                            })
                        })
                    })
                })
            })
        }).connect(config)
    })
}

const verifyAndDeployToSinglePrinter = async (printer, tarPath, archiveSize) => {
    return new Promise((resolve, reject) => {
        const client = new Client()
        const normalizedRemotePath = remotePath.replace(/\/$/, '')
        const config = {
            host: printer.ip,
            port: 22,
            username: printer.user,
            password: printer.pass,
            readyTimeout: 5000
        }

        client.on('error', (err) => reject(new Error(`Pre-check failed to establish link: ${err.message}`)))

        client.on('ready', () => {
            client.exec(`test -d ${normalizedRemotePath}`, (err, stream) => {
                if (err) { 
                    client.end()
                    return reject(err) 
                }

                stream.on('close', async (code) => {
                    client.end()
                    if (code !== 0) {
                        console.log(`[${printer.name}] Sync-Service absent. Deploying files...`)
                        try {
                            await executeRemoteInstallationPipeline(printer, tarPath, archiveSize)
                            console.log(`[${printer.name}] Sync-Service successfully installed`)
                            resolve()
                        } catch (installErr) { 
                            reject(installErr) 
                        }
                    } else {
                                console.log(`[${printer.name}] Service directory discovered, skipping installation`)                            // Resolve anyway to prevent a network/git glitch from crashing your main orchestration pipeline
                                resolve()     
                    }
                })
                stream.resume()
            })
        }).connect(config)
    })
}

const installService = async () => {
    console.log(`Initializing deployment across ${PRINTERS.length} printers`)
    
    let localAssets = null
    
    try {
        localAssets = prepareLocalArchivePackage()
        
        const deploymentPromises = PRINTERS.map(printer => 
            verifyAndDeployToSinglePrinter(printer, localAssets.tarPath, localAssets.archiveSize)
        )

        const runtimeStatuses = await Promise.allSettled(deploymentPromises)

        let successCounter = 0
        let failureCounter = 0

        runtimeStatuses.forEach((status, idx) => {
            const printerLabel = PRINTERS[idx].name
            if (status.status === 'fulfilled') {
                successCounter++
            } else {
                console.error(`[${printerLabel}] job aborted -> ${status.reason.message}`)
                failureCounter++
            }
        })

        console.log(`\nDeployment Summary: ${successCounter} printers configured, ${failureCounter} skipped`)
        
        if (successCounter === 0 && PRINTERS.length > 0) {
            throw new Error("Deployment failed completely across all endpoints")
        }

    } catch (globalCrashError) {
        console.error(`Installer Crash: ${globalCrashError.message}`)
        process.exit(1)
    } finally {
        if (localAssets && typeof localAssets.tmpDir === 'string' && fs.existsSync(localAssets.tmpDir)) {
            console.log('Cleaning temp files')
            fs.rmSync(localAssets.tmpDir, { recursive: true, force: true })
        }
    }
}

module.exports = installService
