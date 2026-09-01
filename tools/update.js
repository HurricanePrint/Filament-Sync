const fs = require('fs')
const path = require('path')
const { exec, spawn } = require('child_process')
const util = require('util')

const execAsync = util.promisify(exec)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'user-config.js')

const userKeys = ['SLICER', 'USERID', 'USER', 'PASSWORD', 'PRINTERS']

function readSource(file) {
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
}

function captureAssignment(source, name) {
    const needle = `const ${name} =`
    const start = source.indexOf(needle)

    if (start === -1) {
        return null
    }

    const afterStart = start + needle.length
    const nextConst = source.indexOf('\nconst ', afterStart)
    const nextModule = source.indexOf('\nmodule.exports', afterStart)

    let end = source.length
    if (nextConst !== -1) end = Math.min(end, nextConst)
    if (nextModule !== -1) end = Math.min(end, nextModule)

    return source.slice(start, end).trim()
}

function replaceAssignment(source, name, assignment) {
    const needle = `const ${name} =`
    const start = source.indexOf(needle)

    if (start === -1) {
        return insertAssignment(source, name, assignment)
    }

    const afterStart = start + needle.length
    const nextConst = source.indexOf('\nconst ', afterStart)
    const nextModule = source.indexOf('\nmodule.exports', afterStart)

    let end = source.length
    if (nextConst !== -1) end = Math.min(end, nextConst)
    if (nextModule !== -1) end = Math.min(end, nextModule)

    return source.slice(0, start) + assignment + source.slice(end)
}

function insertAssignment(source, name, assignment) {
    const beforeModule = source.indexOf('\nmodule.exports')

    if (beforeModule === -1) {
        return `${source.trimEnd()}\n\n${assignment}\n`
    }

    return (
        source.slice(0, beforeModule) +
        `\n${assignment}\n` +
        source.slice(beforeModule)
    )
}

function extractUserAssignments(source) {
    const result = {}

    for (const key of userKeys) {
        const assignment = captureAssignment(source, key)
        if (assignment) {
            result[key] = assignment
        }
    }

    return result
}

async function autoUpdate() {
    let originalSource = ''

    try {
        console.log('Checking for tool updates')

        if (fs.existsSync(configPath)) {
            originalSource = readSource(configPath)
        }

        const userAssignments = extractUserAssignments(originalSource)

        const { stdout, stderr } = await execAsync('git pull', {
            cwd: repoRoot
        })

        const pullOutput = `${stdout}\n${stderr}`

        if (/Already up to date/i.test(pullOutput)) {
            console.log('No repo update available.')
            if (originalSource) {
                fs.writeFileSync(configPath, originalSource)
            }
            return
        }

        await execAsync(
            'git restore --source=HEAD --staged --worktree -- user-config.js',
            { cwd: repoRoot }
        )

        let pulledTemplate = readSource(configPath)

        for (const key of userKeys) {
            if (!userAssignments[key]) continue
            pulledTemplate = replaceAssignment(
                pulledTemplate,
                key,
                userAssignments[key]
            )
        }

        fs.writeFileSync(configPath, pulledTemplate)

        console.log('Updated user-config.js without destroying template text.')

        const child = spawn(process.argv[0], process.argv.slice(1), {
            detached: true,
            stdio: 'inherit'
        })

        child.unref()
        process.exit(0)
    } catch (error) {
        console.error('Update failed:', error.message)
        if (error.stdout) {
            console.error(error.stdout)
        }
        if (error.stderr) {
            console.error(error.stderr)
        }
        if (originalSource) {
            fs.writeFileSync(configPath, originalSource)
        }
    }
}

module.exports = autoUpdate