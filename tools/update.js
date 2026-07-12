const { exec, spawn } = require('child_process')
const util = require('util')
const execAsync = util.promisify(exec)

async function autoUpdate() {
    try {
        console.log('Checking for tool updates')

        await execAsync('git stash push -m "temp-config-stash" user-config.js').catch(() => {})

        const { stdout } = await execAsync('git pull');

        await execAsync('git stash pop').catch(() => {})

        if (stdout.includes('Already up to date.')) {
            console.log('Tool is up to date.')
        } else {
            console.log('Updates downloaded successfully! Relaunching script')
            
            const child = spawn(process.argv[0], process.argv.slice(1), {
                detached: true,
                stdio: 'inherit'
            });

            child.unref()
            process.exit(0)
        }
    } catch (error) {
        console.log('Could not check for updates (offline or Git missing)')
    }
}

module.exports = autoUpdate