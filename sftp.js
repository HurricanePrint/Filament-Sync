let Client = require('ssh2-sftp-client');
let sftp = new Client();
const {PRINTERIP, PASSWORD} = require('./env.js')

const connect = () => {
    sftp.connect({
        host: PRINTERIP || '127.0.0.1',
        port: '22',
        username: 'root',
        password: PASSWORD || 'creality_2024'
    }).then(() => {
    return sftp.list('/root');
    }).then(data => {
    console.log(data, 'the data info');
    }).catch(err => {
    console.log(err, 'catch error');
    })
}

const sendFile = (sendData, filename) => {
    let file = '/root/profile-sync/data'+filename
    console.log(sendData)
    sftp.connect({
        host: PRINTERIP || '127.0.0.1',
        port: '22',
        username: 'root',
        password: PASSWORD || 'creality_2024'
    }).then(() => {
        return sftp.put(sendData, file)
    }).then(() => {
        sftp.end()
    }).catch(err => {
    console.log(err, 'catch error');
    })
}


module.exports = {sendFile}