import {
    cancelAllRequest,
} from 'services/SDK/main'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Modal Report Table] Callback Required'))
        this.buttonId = randomString(10, {onlyChars: true})
        this.modalId = randomString(10, {onlyChars: true})
        this.data = {schedule: {}}
        this.callbackData = {}
        this.modalEnabled = false
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onUpdated(props, local) {
        const data = props.masterData
        if (this.data === data) return null
        if (props.showModal && this.modalEnabled !== props.showModal) {
            this.showModal()
            this.data = data
            this.update()
        }
    },
    showModal() {
        const el = $('#' + this.modalId)
        el.modal('show')
        el.on('hidden.bs.modal', () => {
            this.modalEnabled = false
            this.data = null
            this.callback()
        })
    },
    callback(data) {
        this.props.callback(data)
    }
}