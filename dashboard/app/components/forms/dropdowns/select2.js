import {
    cancelAllRequest,
} from 'appsdk'

import { showAlertError, randomString, debugLog } from 'apphelpers/utilities'

export default {
    onBeforeMount(props) {
        this.config = {}
        this.config.loading = false
        this.config.selectorId = randomString(10, { onlyChars: true })
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        this.init(this.props.select2Options)
    },
    onBeforeUpdate(props) {
    },
    onUpdated(props) {},
    onBeforeUnmount(props) {
        cancelAllRequest()
    },
    init(opt={}) {
        const id = '#' + this.config.selectorId
        $(id).select2(opt)
        $(id).on('select2:close', this.callback)
    },
    callback(e) {
        const id = '#' + this.config.selectorId
        const el = $(id).find(':selected')
        let selectedItems = []
        for (const x in el) {
            const value = el[x].value
            if (value) selectedItems.push(value)
        }
        this.props.callback(selectedItems)
    }
}