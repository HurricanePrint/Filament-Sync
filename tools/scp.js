const {Client} = require('node-scp')
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERIP, USER, PASSWORD} = require(dirname + '/network-config.js')
const remoteFileDir = '/root/Filament-Sync-Service/data'
const jaminFileDir = '/mnt/UDISK/root/Filament-Sync-Service/data'
const localDataDir = dirname + '/data'


let runCommand = async () => {
    try {
        await ssh.connect({
            host: PRINTERIP,
            port: '22',
            username: USER,
            password: PASSWORD
        });
        await ssh.execCommand('sh /root/Filament-Sync-Service/service/sync.sh');
    } catch (error) {
        console.error('SSH connection or command execution error:', error);
    } finally {
        ssh.dispose();
    }
}

const sendFiles = () => {
    let remoteDir = ''
    Client({
        host: PRINTERIP,
        port: 22,
        username: USER,
        password: PASSWORD,
    }).then(client => {
        const result = client.exists(jaminFileDir)
        .then(result => {
            if (result) {
                remoteDir = jaminFileDir
            } else {
                remoteDir = remoteFileDir
            }
        }).then(() => {
            client.uploadDir(localDataDir, remoteDir)
            .then(response => {
                client.close() 
            }).then(() => {
                runCommand()
            }).catch(error => console.log(error))
        })
    }).catch(error => console.log(error))
}

module.exports = {sendFiles}