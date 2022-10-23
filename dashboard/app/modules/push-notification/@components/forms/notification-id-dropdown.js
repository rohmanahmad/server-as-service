import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    pushNotifCode,
} from 'appModule/push-notification/push-notification.sdk'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Notification Id Dropdown] Callback Required'))
        this.notificationIds = [
            // {name: 'a', title: 'A'},
        ]
        this.dropdownId = randomString(10, {onlyChars: true})
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
        this.getItems()
            .then((res) => {
                this.notificationIds = res.data.map(x => ({id: x.id, counter: x.counter, title: x.code}))
                this.update()
            })
    },
    // data
    async getItems() {
        const data = await pushNotifCode()
        return data
    },
    // callback
    callback(data) {
        const selected = this.notificationIds.filter(x => x.title === data.value)
        if (selected.length === 0) return showAlertError(new Error('Invalid Selected Data'))
        this.props.callback({
            inc: selected[0].counter,
            title: selected[0].title,
            code: selected[0].code
        })
    }
}