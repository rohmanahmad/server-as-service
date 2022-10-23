import { result } from 'lodash'

class Validation {
    constructor (data) {
        this.data = data
        this.prefixMsg = ''
    }
    setOption(options) {
        const pfErr = result(options, 'prefix_error_msg', '')
        if (pfErr) this.prefixMsg = `[${pfErr}] `
        return this
    }

    customValidate (rules) {
        for (const rKey in rules) {
            const {type, required} = rules[rKey]
            if (type) {
                this.execute(rKey, type)
            }
            if (required) this.execute(rKey, 'required')
        }
    }

    validate (config) {
        try {
            for (const field in config) {
                const types = (config[field] || '')
                    .split(',')
                    .map(x => x.trim())
                    .filter(x => x.length > 0)
                if (types.length === 0) continue
                for (const type of types) {
                    this.execute(field, type)
                }
            }
        } catch (err) {
            throw err
        }
    }

    execute(field, type) {
        switch (type) {
            case 'required':
                this.requiredValidation(field)
                break;
            case 'string':
                this.stringValidation(field)
                break;
            case 'function':
                this.functionValidation(field)
                break;
            default:
                break;
        }
    }

    // validation actions
    functionValidation(field) {
        const type = result(this.data, field)
        debugger
        if (typeof type !== 'function') {
            throw new Error(this.prefixMsg + field + ' Should Be a Function')
        }
    }
    stringValidation(field) {
        if (typeof result(this.data, field) !== 'string') throw new Error(this.prefixMsg + field + ' Invalid String Format')
    }
    requiredValidation(field) {
        const msg = `${this.prefixMsg}${field} Required`
        if (!result(this.data, field)) throw new Error(msg)
    }
}

const newNotificationValidationConfig = {
    notificationId: 'required',
    title: 'required',
    body: 'required',
    targetLink: 'required',
}
export const newNotificationValidation = function (data)  {
    new Validation(data).validate(newNotificationValidationConfig)
}

const updateNotificationValidationConfig = {
    notificationId: 'required',
    title: 'required',
    body: 'required',
    targetLink: 'required',
}
export const updateNotificationValidation = function (data)  {
    new Validation(data).validate(updateNotificationValidationConfig)
}

const rejectedPushNotificationValidationConfig = {
    comment: 'required'
}
export const rejectedPushNotificationValidation = function (data) {
    new Validation(data).validate(rejectedPushNotificationValidationConfig)
}

const approvedPushNotificationValidationConfig = {
    imageUpload: 'required'
}
export const approvedPushNotificationValidation = function (data) {
    new Validation(data).validate(approvedPushNotificationValidationConfig)
}
const sendTestMessageValidationConfig = {
    title: 'required',
    body: 'required',
    messageCategory: 'required',
    screenRedirection: 'required',
}
export const sendTestMessageValidation = function (data) {
    new Validation(data).validate(sendTestMessageValidationConfig)
}

export const customValidation = function (data, rules, options={}) {
    if (!rules) throw new Error('Invalid Rules')
    new Validation(data).setOption(options).customValidate(rules)
}
