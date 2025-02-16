const Client = require('ssh2-sftp-client');
const sftp = new Client();
const {NodeSSH} = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path')
const dirname = path.join(__dirname, '..')
const {PRINTERIP, USER, PASSWORD} = require(dirname + '/network-config.js')
const remoteFileDir = '/root/Filament-Sync-Service/data/'
const localDataDir = './data/'

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

const sendFile = (database, option) => {
    sftp.connect({
        host: PRINTERIP || '127.0.0.1',
        port: '22',
        username: USER,
        password: PASSWORD || 'creality_2024'
    }).then(() => {
        const remoteDatabaseFile = remoteFileDir + database
        const localDatabaseFile = localDataDir + database
        return sftp.put(localDatabaseFile, remoteDatabaseFile)
    }).then(() => {
        const remoteOptionFile = remoteFileDir + option
        const localOptionFile = localDataDir + option
        return sftp.put(localOptionFile, remoteOptionFile)
    }).then(() => {
        sftp.end()
    }).then(() => {
        runCommand()
    }).catch(err => {
        console.log(err, 'catch error');
    })
}

module.exports = {sendFile}