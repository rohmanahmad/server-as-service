import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    pushNotifUploadImage,
} from 'appModule/push-notification/push-notification.sdk'
import { randomString, showAlertError, debugLog } from 'helpers/utilities'

export default {
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onBeforeMount(props) {
        const isNeedUploadInitial = !props.initialValue
        this.upload = {
            loading: false,
            loadingTitle: 'Loading...',
            need_upload: isNeedUploadInitial,
            upload_success: false,
            upload_fail: false
        }
        this.inputId = randomString(10, { onlyChars: true })
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUpdate() {},
    callback(data) {
        this.props.callback(data)
    },
    previewCallback(res) {
        this.fileData = res.fileData.file
        this.upload.upload_success = false
        this.upload.upload_fail = false
        this.upload.need_upload = true
        this.upload.is_reset = false
        this.update()
        this.props.previewCallback(res)
    },
    doUpload(e) {
        if (e && e.preventDefault) e.preventDefault()
        if (!this.fileData) return showAlertError(new Error('No Image Selected'))
        const opt = {
            onUploadProgress: (progressEvent) => {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                this.upload.loading  = true
                this.upload.loadingTitle = `Uploading...(${percentage}%)`
                this.update()
            }
        }
        pushNotifUploadImage({ file: this.fileData }, opt)
            .then((res) => {
                this.upload.upload_success = true
                this.upload.upload_fail = false
                this.upload.need_upload = false
                this.upload.is_reset = true
                this.upload.loading  = false
                this.update()
                this.callback({ success: true, response: res })
            })
            .catch(err => {
                showAlertError(err)
                this.upload.upload_success = false
                this.upload.upload_fail = true
                this.upload.need_upload = true
                this.upload.is_reset = true
                this.upload.loading  = false
                this.callback({ success: false })
                this.update()
            })
    },
    removeUploadedImage(e) {
        if (e && e.preventDefault) e.preventDefault()
        this.upload.need_upload = true
        this.fileData = null
        this.upload.upload_success = false
        this.upload.upload_fail = false
        this.upload.is_reset = true
        this.update()
        this.props.removeCallback()
    }
}