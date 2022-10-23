import { showAlertError, randomString, debugLog } from 'helpers/utilities'
import { result } from 'lodash'
import { paymentMethods } from 'appModule/billpayment/billpayment.config'
export default {
    onBeforeMount(props) {
        this.config = {}
        this.config.loading = true
        this.config.methods = props.methods || []
        if (typeof props.callback !== 'function') showAlertError(new Error('[Select Payment Methods] Callback Is Required'))
    },
    onBeforeUnmount(props) {},
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (props.methods) {
            this.config.methods = props.methods || []
            this.update()
        } else {
            this.getBillers()
        }
    },
    onBeforeUpdate(props) {
        if (props.availableMethods) {
            this.config.methods = this.getStaticMethods().filter(x => props.availableMethods.indexOf(x.name) > -1)
        } else {
            this.config.methods = this.getStaticMethods()
        }
    },
    onUpdated(props) {
        if (this.currentSelected !== props.selected) {
            const cb = props.callback
            const data = result(this.config, 'methods', []).filter(x => x.name === props.selected)
            this.currentSelected = props.selected
            cb(result(data, '[0]', {}))
        }
    },
    async getBillers() {
        try {
            debugLog('get billers manual if not set in first')
            this.config.methods = this.getStaticMethods()
            this.config.loading = false
            this.update()
        } catch (err) {
            showAlertError(err)
        }
    },
    getStaticMethods() {
        return paymentMethods
    },
    updateSelectedMethod(res) {
        const cb = this.props.callback
        cb(res.data || {})
    },
}