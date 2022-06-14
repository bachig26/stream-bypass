import {Match, matches} from "../match/match";

async function storageGet(key: string): Promise<any> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (value) => {
            resolve(value[key])
        })
    })
}

async function storageSet(key: string, value: any) {
    const obj = {}
    obj[key] = value
    await chrome.storage.local.set(obj)
}

export async function getDisabled(): Promise<Match[]> {
    const localMatches = []

    for (const disabled of (await storageGet('disabled') as string[]) || []) {
        let m: Match
        if ((m = matches.find((v) => v.id === disabled)) !== undefined) {
            localMatches.push(m)
        }
    }

    return localMatches
}

export async function getAllDisabled(): Promise<boolean> {
    const value = await storageGet('all')
    return value !== undefined ? value as unknown as boolean : false
}

export async function enableAll() {
    await storageSet('all', false)
}

export async function disableAll() {
    await storageSet('all', true)
}

export async function enable(match: Match) {
    const disabled = await storageGet('disabled') || []
    disabled.splice(disabled.indexOf(match.id))
    await storageSet('disabled', disabled)
}

export async function disable(match: Match) {
    const disabled = await storageGet('disabled') as string[] || []
    if (disabled.indexOf(match.id) !== undefined) {
        disabled.push(match.id)
        await storageSet('disabled', disabled)
    }
}
