const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const util = require('util')
const { exec } = require('child_process')

const execAsync = util.promisify(exec)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'user-config.js')

const preservedKeys = [
    'SLICER',
    'USERID',
    'USER',
    'PASSWORD',
    'PRINTERS'
]

function loadConfig() {
    delete require.cache[require.resolve(configPath)]
    return require(configPath)
}

function isPlainObject(value) {
    return value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
}

function mergeExistingValues(updatedValue, oldValue) {
    if (Array.isArray(updatedValue)) {
        if (!Array.isArray(oldValue)) {
            return updatedValue
        }

        return updatedValue.map((newItem, index) => {
            if (!isPlainObject(newItem)) {
                return newItem
            }

            const oldItem = newItem.name
                ? oldValue.find(item =>
                    isPlainObject(item) &&
                    item.name === newItem.name
                )
                : oldValue[index]

            return mergeExistingValues(newItem, oldItem || {})
        })
    }

    if (!isPlainObject(updatedValue) || !isPlainObject(oldValue)) {
        return updatedValue
    }

    const merged = { ...updatedValue }

    for (const key of Object.keys(updatedValue)) {
        if (!Object.prototype.hasOwnProperty.call(oldValue, key)) {
            continue
        }

        if (isPlainObject(updatedValue[key]) ||
            Array.isArray(updatedValue[key])) {
            merged[key] = mergeExistingValues(
                updatedValue[key],
                oldValue[key]
            )
        } else {
            merged[key] = oldValue[key]
        }
    }

    return merged
}

function mergeUserConfig(updatedConfig, oldConfig) {
    const merged = { ...updatedConfig }

    for (const key of preservedKeys) {
        if (!Object.prototype.hasOwnProperty.call(updatedConfig, key) ||
            !Object.prototype.hasOwnProperty.call(oldConfig, key)) {
            continue
        }

        merged[key] = key === 'PRINTERS'
            ? mergeExistingValues(updatedConfig[key], oldConfig[key])
            : oldConfig[key]
    }

    return merged
}

function writeConfig(config) {
    fs.writeFileSync(
        configPath,
        `module.exports = ${JSON.stringify(config, null, 2)}\n`
    )
}

async function autoUpdate() {
    let originalConfigSource

    try {
        console.log('Checking for tool updates')

        originalConfigSource = fs.readFileSync(configPath, 'utf8')
        const currentConfig = loadConfig()

        await execAsync(
            'git restore --source=HEAD --staged --worktree -- user-config.js',
            { cwd: repoRoot }
        )

        const { stdout, stderr } = await execAsync('git pull', {
            cwd: repoRoot
        })

        const updatedConfig = loadConfig()

        writeConfig(
            mergeUserConfig(updatedConfig, currentConfig)
        )

        if (/Already up to date/i.test(`${stdout}\n${stderr}`)) {
            console.log('Tool is up to date')
            return
        }

        console.log('Updates downloaded successfully! Relaunching script')

        const child = spawn(process.argv[0], process.argv.slice(1), {
            detached: true,
            stdio: 'inherit'
        })

        child.unref()
        process.exit(0)
    } catch (error) {
        if (originalConfigSource) {
            fs.writeFileSync(configPath, originalConfigSource)
        }

        console.log('Could not check for updates (offline or Git missing)')
    }
}

module.exports = autoUpdate