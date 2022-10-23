import { logInfo } from 'apphelpers/utilities'

export const changeStorage = (data, prefix) => {
    if (prefix) prefix = `${prefix}_`
    for (const key in data) {
        const value = data[key]
        const fullKey = `${prefix}${key}`
        localStorage.setItem(fullKey, value)
        logInfo(`[STORAGE] setting ${fullKey}`)
    }
}
export const getStorage = (key, prefix, defaultValue) => {
    if (prefix) prefix = `${prefix}_`
    const fullKey = `${prefix}${key}`
    const v = localStorage.getItem(fullKey)
    logInfo(`[STORAGE] getting ${fullKey}`)
    return v || defaultValue
}

export const deleteStorage = (item) => {
    localStorage.removeItem(item)
}
