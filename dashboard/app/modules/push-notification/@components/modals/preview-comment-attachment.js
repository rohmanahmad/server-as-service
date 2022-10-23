import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    getPushNotifComments
} from 'appModule/push-notification/push-notification.sdk'
import { result } from 'lodash'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Modal Add FCM Token] Callback Required'))
        this.modalId = randomString(10, {onlyChars: true})
        this.modalEnabled = false
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onUpdated(props, local) {
        console.log(props.showModal, this.modalEnabled, !this.item)
        if (props.showModal && this.modalEnabled !== props.showModal && !this.item) {
            this.showModal()
            // this.buttons.reject.disabled = false
            // this.buttons.approve.disabled = false
            const masterId = props.elData.id
            if (!masterId) throw new Error('Invalid Master ID')
            this.item = {}
            this.getAttachmentImage(masterId)
        }
    },
    showModal() {
        const el = $('#' + this.modalId)
        el.modal('show')
        el.on('hidden.bs.modal', () => {
            this.modalEnabled = false
            this.item = null
            this.props.callback({refresh: false})
        })
    },
    hideModal() {
        const el = $('#' + this.modalId)
        el.modal('hide')
    },
    getAttachmentImage(masterId) {
        getPushNotifComments({ masterId: masterId })
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                if (!res) return null
                this.item = result(res, 'data[0]', {})
                this.update()
            })
    }
}