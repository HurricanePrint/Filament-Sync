const { execSync } = require('child_process')
const path = require('path')
const os = require('os')
const fs = require('fs')
const { Client } = require('ssh2')

const repoUrl = "https://github.com/HurricanePrint/Filament-Sync-Service.git"
const remotePath = "/mnt/UDISK/printer_data/config/Filament-Sync-Service"
const dirname = path.join(__dirname, '..')
const { PRINTERIP, USER, PASSWORD } = require(path.join(dirname, 'user-config.js'))

const config = {
    host: PRINTERIP,
    port: 22,
    username: USER,
    password: PASSWORD,
    readyTimeout: 10000 // 10 second timeout
}

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath)
  arrayOfFiles = arrayOfFiles || []

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

const install = async () => {
    const client = new Client()
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-transfer-'))
    const localRepoPath = path.join(tmpDir, 'cloned_repo')
    const tarPath = path.join(tmpDir, 'repo.tar')
    const remotePath = "/mnt/UDISK/printer_data/config/Filament-Sync-Service"

    return new Promise((resolve, reject) => {
        try {
            console.log('Cloning repository...')
            execSync(`git clone ${repoUrl} ${localRepoPath}`, { stdio: 'ignore' })

            console.log('Creating archive...')
            execSync(`tar -cf ${tarPath} -C ${localRepoPath} .`)

            const stats = fs.statSync(tarPath)

            client.on('ready', () => {
                console.log('SSH Ready. Preparing remote directory...')
                
                client.exec(`mkdir -p ${remotePath} && scp -t ${remotePath}`, (err, stream) => {
                    if (err) return reject(err)

                    stream.write(`C0644 ${stats.size} repo.tar\n`)
                    
                    stream.once('data', (data) => {
                        if (data[0] !== 0x00) return reject(new Error('SCP Handshake Failed'))

                        const readStream = fs.createReadStream(tarPath)
                        readStream.pipe(stream, { end: false })

                        readStream.on('end', () => {
                            stream.write('\x00')
                            
                            stream.once('data', (ack) => {
                                if (ack[0] !== 0x00) return reject(new Error('SCP Transfer Failed'))
                                stream.end()

                                console.log('Extracting and installing...')
                                const remoteCmd = `cd ${remotePath} && tar -xf repo.tar && rm repo.tar && sh install.sh`
                                
                                client.exec(remoteCmd, (err, installStream) => {
                                    if (err) return reject(err)
                                    
                                    installStream.on('close', (code) => {
                                        client.end()
                                        if (code === 0) {
                                            fs.rmSync(tmpDir, { recursive: true, force: true })
                                            resolve()
                                        } else {
                                            reject(new Error('Remote extraction or install failed'))
                                        }
                                    })
                                    installStream.resume()
                                })
                            })
                        })
                    })
                })
            }).on('error', reject).connect(config)
        } catch (err) {
            if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true })
            reject(err)
        }
    })
}

const installService = () => {
    const client = new Client();
    const normalizedRemotePath = remotePath.replace(/\/$/, '');

    return new Promise((resolve, reject) => {
        client.on('ready', () => {
            client.exec(`test -d ${normalizedRemotePath}`, (err, stream) => {
                if (err) { 
                    client.end()
                    return reject(err) 
                }

                stream.on('close', async (code) => {
                    client.end()
                    if (code !== 0) {
                        console.log('Service not found. Starting installation...')
                        try {
                            await install()
                            resolve()
                        } catch (e) { reject(e) }
                    } else {
                        console.log('Service directory already exists. Skipping install.')
                        resolve()
                    }
                })
                stream.resume()
            })
        }).on('error', reject).connect(config)
    })
}

module.exports = installService