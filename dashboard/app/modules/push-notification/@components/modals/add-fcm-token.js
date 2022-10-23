import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    createFCMToken,
} from 'appModule/push-notification/push-notification.sdk'
import { showAlertError, showAlertSuccess, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Modal Add FCM Token] Callback Required'))
        this.buttonId = randomString(10, {onlyChars: true})
        this.modalId = randomString(10, {onlyChars: true})
        this.usernameId = randomString(10, {onlyChars: true})
        this.emailId = randomString(10, {onlyChars: true})
        this.callbackData = {}
        this.isprocessing = false
        this.modalEnabled = false
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onUpdated(props, local) {
        if (props.showModal && this.modalEnabled !== props.showModal) {
            this.showModal()
        }
    },
    showModal() {
        const el = $('#' + this.modalId)
        el.modal('show')
        el.on('hidden.bs.modal', () => {
            this.modalEnabled = false
            this.$('#' + this.usernameId).value = ''
            this.$('#' + this.emailId).value = ''
            this.callback()
        })
    },
    hideModal() {
        const el = $('#' + this.modalId)
        el.modal('hide')
    },
    doCreateNewFCMToken() {
        const username = this.$('#' + this.usernameId).value
        const email = this.$('#' + this.emailId).value
        if (!username) return showAlertError(new Error('Invalid Username'))
        if (!email) return showAlertError(new Error('Invalid email'))
        if (email.length < 5) return showAlertError(new Error('Invalid email'))
        const indexAt = email.indexOf('@')
        if (indexAt < 1 || indexAt === (email.length -1)) return showAlertError(new Error('Invalid email'))
        if (username && email) {
            createFCMToken({email, username})
                .catch(err => {
                    showAlertError(err)
                    return null
                })
                .then(r => {
                    if (!r) return this.callback({ hide: true, success: false, refresh: false })
                    showAlertSuccess('Test On Device Details Created')
                    this.callback({ hide: true, success: true, refresh: true })
                    this.hideModal()
                })
        }
    },
    callback(data) {
        this.props.callback(data)
    }
}