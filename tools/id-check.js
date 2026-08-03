// Warns when profile ids clash with a stock filament or with each other
const fs = require('fs')
const path = require('path')
const readline = require('readline/promises')
const databaseFile = path.join(__dirname, '..', 'data', 'material_database.json')
const {readProfiles} = require('./config')

const readNotes = (profile) => {
    let notes = profile.filament_notes
    if (Array.isArray(notes)) notes = notes[0]
    return typeof notes == 'string' ? JSON.parse(notes) : notes
}

const readName = (profile, notes) => {
    let name = notes.name || profile.name
    return Array.isArray(name) ? name[0] : name
}

const findIdProblems = (profiles, stockList) => {
    let collisions = []
    let usedIds = {}
    for (let profile of profiles) {
        let notes = readNotes(profile)
        let name = readName(profile, notes)
        let stock = stockList.find(entry => entry.base.id == notes.id)
        if (stock) {
            collisions.push({
                id: notes.id,
                profileName: name,
                stockBrand: stock.base.brand,
                stockName: stock.base.name
            })
        }
        if (usedIds[notes.id] == undefined) usedIds[notes.id] = []
        usedIds[notes.id].push(name)
    }
    let duplicates = Object.keys(usedIds)
        .filter(id => usedIds[id].length > 1)
        .map(id => ({id: id, profileNames: usedIds[id]}))
    return {collisions: collisions, duplicates: duplicates}
}

const printProblems = (problems) => {
    if (problems.collisions.length) {
        console.warn('\nThese profiles use an id that a stock filament already owns:')
        for (let hit of problems.collisions) {
            let stock = hit.stockName.startsWith(hit.stockBrand) ? hit.stockName : `${hit.stockBrand} ${hit.stockName}`
            console.warn(`  ${hit.id}  "${hit.profileName}" replaces ${stock}`)
        }
        console.warn('The stock filament will not show on the printer while that id is in use.')
        console.warn('To get it back, give your profile an unused id (90000 and up is free) and sync again.')
        console.warn('If you already wrote this id to an RFID tag, the tag keeps pointing at the old id.')
    }
    if (problems.duplicates.length) {
        console.warn('\nThese profiles share an id with each other:')
        for (let duplicate of problems.duplicates) {
            console.warn(`  ${duplicate.id}  ${duplicate.profileNames.join(', ')}`)
        }
        console.warn('Every profile needs its own 5 digit id or the printer cannot tell them apart.')
    }
}

const askUser = async (question) => {
    const prompt = readline.createInterface({input: process.stdin, output: process.stdout})
    const answer = await prompt.question(question)
    prompt.close()
    return answer
}

const checkIds = async (ask = askUser) => {
    let database = JSON.parse(fs.readFileSync(databaseFile))
    let problems = findIdProblems(readProfiles(), database.result.list)
    if (!problems.collisions.length && !problems.duplicates.length) return true
    printProblems(problems)
    // Runs headless as a slicer post processing script, so only prompt with a terminal attached
    if (!process.stdin.isTTY) {
        console.warn('\nNo terminal attached, syncing anyway.')
        return true
    }
    let answer = await ask('\nSync anyway? [y/N] ')
    if (answer.trim().toLowerCase().startsWith('y')) return true
    console.warn('Sync cancelled, nothing was sent to the printer.')
    return false
}

module.exports = {checkIds, findIdProblems}
