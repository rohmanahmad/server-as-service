import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    getDestinationPages,
} from 'appModule/push-notification/push-notification.sdk'
import { showAlertError, showAlertSuccess, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Notification Id Dropdown] Callback Required'))
        this.destinationPages = [
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
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then((res) => {
                if (!res) return
                this.destinationPages = res.data.map(x => ({name: x.screenRedirectionValue, title: x.destination}))
                const s = this.destinationPages.filter(x => x.name === this.props.selected)
                this.selected = s && s[0] ? s[0]['name'] : ''
                if (!this.selected) this.selected = 'HOME_SCREEN'
                this.update()
            })
    },
    // data
    async getItems() {
        const data = await getDestinationPages()
        return data
    },
    // callback
    callback(data) {
        const selected = this.destinationPages.filter(x => x.name === data.value)
        if (selected.length === 0) return showAlertError(new Error('Invalid Selected Data'))
        this.props.callback({
            name: selected[0].name,
            title: selected[0].title
        })
    }
}