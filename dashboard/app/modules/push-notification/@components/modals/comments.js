import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    getPushNotifComments,
} from 'appModule/push-notification/push-notification.sdk'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Modal Comments] Callback Required'))
        this.buttonId = randomString(10, {onlyChars: true})
        this.modalId = randomString(10, {onlyChars: true})
        this.items = []
        this.callbackData = {}
        this.isprocessing = false
        this.modalEnabled = false
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        const masterData = props.masterData
        this.getList(masterData)
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onUpdated(props, local) {
        if (!props.masterData) return null
        this.notifId = props.masterData.notificationId
        const masterId = parseInt(props.masterData.id)
        if (this.masterId === masterId) return null
        if (props.showModal && this.modalEnabled !== this.props.showModal) {
            this.showModal()
            this.getList(masterId)
            this.masterId = masterId
        }
    },
    showModal() {
        const el = $('#' + this.modalId)
        el.modal('show')
        el.on('hidden.bs.modal', () => {
            this.modalEnabled = false
            this.masterId = null
            this.callback(false)
        })
    },
    callback(data) {
        this.props.callback(data)
    },
    getList(masterId) {
        if (masterId) {
            getPushNotifComments({
                masterId,
                limit: 5
            })
                .catch(err => {
                    showAlertError(err)
                    return null
                })
                .then(res => {
                    if (res) {
                        this.items = res.data
                        this.update({update: false})
                    }
                })
        }
    }
}