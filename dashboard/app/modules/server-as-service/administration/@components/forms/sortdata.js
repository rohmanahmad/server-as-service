import { showAlertError, debugLog } from 'apphelpers/utilities'
export default {
    onBeforeMount() {
        this.callbackData = {
            sort_key: 'id',
            sort_dir: 'desc'
        }
        this.datadir = [
            { name: 'asc', title: 'Asc' },
            { name: 'desc', title: 'Desc' },
        ]
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (typeof props.callback !== 'function') {
            showAlertError(new Error('[Sort Data] Callback Should Be a Function'))
        }
    },
    changeData(key, data) {
        this.callbackData[key] = data.name
        this.props.callback(this.callbackData)
    }
}