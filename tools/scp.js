const {Client} = require('node-scp')
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERIP, USER, PASSWORD} = require(dirname + '/user-config.js')
const remoteFileDir = '/root/Filament-Sync-Service/data'
const jaminFileDir = '/mnt/UDISK/root/Filament-Sync-Service/data'
const localDataDir = dirname + '/data'

let runCommand = async (directory) => {
    try {
        await ssh.connect({
            host: PRINTERIP,
            port: '22',
            username: USER,
            password: PASSWORD
        });
        await ssh.execCommand('sh ' + directory + '/service/sync.sh');
    } catch (error) {
        console.error('\nCheck user-config.js to make sure printer info is set correctly\n')
        console.error('SSH connection or command execution error:', error);
    } finally {
        ssh.dispose();
    }
}

// const checkDirectory = new Promise((resolve,reject) => {
//     let remoteDir = ''
//     Client({
//         host: PRINTERIP,
//         port: 22,
//         username: USER,
//         password: PASSWORD,
//     }).then((client) => {
//         const result = client.exists(jaminFileDir)
//         .then(result => {
//             if (result != false) {
//                 remoteDir = jaminFileDir
//             } else {
//                 remoteDir = remoteFileDir
//             }
//         }).then(()=> {
//             client.close()
//             resolve(remoteDir)
//         })
//     }).catch(error => {
//         console.error('\nCheck user-config.js to make sure printer info is set correctly\n')
//         console.error(error)
//     })
// })

const checkDirectory = () => {
    return new Promise((resolve,reject) => {
        let remoteDir = ''
        Client({
            host: PRINTERIP,
            port: 22,
            username: USER,
            password: PASSWORD,
        }).then((client) => {
            const result = client.exists(jaminFileDir)
            .then(result => {
                if (result != false) {
                    remoteDir = jaminFileDir
                } else {
                    remoteDir = remoteFileDir
                }
            }).then(()=> {
                client.close()
                resolve(remoteDir)
            })
        }).catch(error => {
            console.error('\nCheck user-config.js to make sure printer info is set correctly\n')
            console.error(error)
        })
    })
} 



const sendFiles = () => {
    let remoteDir = ''
        checkDirectory().then((response) => {
            remoteDir = response
        }).then(() => {
            Client({
                host: PRINTERIP,
                port: 22,
                username: USER,
                password: PASSWORD,
            }).then(client => {
                client.uploadDir(localDataDir, remoteDir)
                    .then(response => {
                        client.close() 
            }).then(() => {
                commandDir = path.join(remoteDir, '..')
                runCommand(commandDir)
            }).catch(error => {
                console.error('\nCheck user-config.js to make sure printer info is set correctly\n')
                console.error(error)
            })
        })
    })
}
 
module.exports = {sendFiles}