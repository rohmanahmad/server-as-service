import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    getFCMTokens,
    deleteFCMToken
} from 'appModule/push-notification/push-notification.sdk'
import { showAlertSuccess, showAlertError, debugLog } from 'helpers/utilities'
export default {
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onBeforeMount(props) {
        this.fcmTokens = [
            {id: '', title: ''}
        ]
        this.refreshStatus = false
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (typeof props.callback !== 'function') return showAlertError(new Error('[FCM Token List] Callback Should Be a Function'))
        this.FCMTokensList()
        this.callback({ refresh: false })
    },
    onBeforeUpdate(props) {
        if (props.refresh) this.FCMTokensList()
    },
    callback(data) {
        this.props.callback(data)
    },
    FCMTokensList() {
        getFCMTokens({
            sort: 'CREATED_AT',
            sortOrder: 'DESC'
        })
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                if(res && res.data) {
                    this.fcmTokens = res.data
                    this.update()
                }
                this.callback({ refresh: false })
            })
    },
    checkedVal(val) {
        const name = val.name
        let data = []
        for (const v of this.items) {
            if (v.name === name) {
                v.checked = !val.checked
            }
            data.push(v)
        }
        this.items = data
    },
    doDeleteFCMToken({ data }) {
        const conf = confirm('Delete?')
        if (!conf || !data) return showAlertError(new Error('Invalid Data'))
        if (data && !data.id) return showAlertError(new Error('Invalid Item ID'))
        deleteFCMToken({
            fcm_id: data.id
        })
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                if (!res) return false
                showAlertSuccess('Test On Device Details Successfully Deleted')
                this.FCMTokensList()
            })
    },
    doRefreshFCMToken(data) {
        // alert('on-going')
    },
    toggleChecked(key, isChecked, item={}) {
        this.callback({key, isChecked, item, refresh: false})
    }
}