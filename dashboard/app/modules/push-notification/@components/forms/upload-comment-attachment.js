import {
    cancelAllRequest,

} from 'services/SDK/main'
import {
    pushNotifUploadCommentAttachment,
} from 'appModule/push-notification/push-notification.sdk'
import { randomString, showAlertError, debugLog } from 'helpers/utilities'

export default {
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onBeforeMount() {
        this.inputId = randomString(10, { onlyChars: true })
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUpdate() {},
    callback(data) {
        this.props.callback(data)
    },
    doUpload() {
        debugLog('upload in progress')
        const el = this.$('#' + this.inputId)
        const file = el.files[0]
        if (file) {
            pushNotifUploadCommentAttachment({ file })
                .then((res) => {
                    this.callback({ success: true, response: res })
                })
                .catch(err => {
                    showAlertError(err)
                    this.callback({ success: false })
                })
        }
    },
}