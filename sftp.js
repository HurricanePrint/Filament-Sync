let Client = require('ssh2-sftp-client');
let sftp = new Client();
const {PRINTERIP, PASSWORD} = require('./env.js')

const sendFile = (database, option) => {
    sftp.connect({
        host: PRINTERIP || '127.0.0.1',
        port: '22',
        username: 'root',
        password: PASSWORD || 'creality_2024'
    }).then(() => {
        let file = '/root/profile-sync/data/'+database
        let localDataDir = './data/'+database
        return sftp.put(localDataDir, file)
    }).then(() => {
        let file = '/root/profile-sync/data/'+option
        let localDataDir = './data/'+option
        return sftp.put(localDataDir, file)
    }).then(() => {
        sftp.end()
    }).catch(err => {
    console.log(err, 'catch error');
    })
}


module.exports = {sendFile}