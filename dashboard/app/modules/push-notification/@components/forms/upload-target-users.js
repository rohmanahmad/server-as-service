import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    pushNotifGetTargetUserStatus
} from 'appModule/push-notification/push-notification.sdk'
import { result } from 'lodash'
import axios from 'axios'
import { randomString, showAlertError, debugLog } from 'helpers/utilities'

export default {
    init() {
        this.upload = {}
        this.upload.title = 'Upload'
        this.upload.upload_success = false
        this.upload.upload_fail = false
        this.upload.need_upload = true
        this.upload.is_processing = false
        this.upload.processDone = false
        this.upload.is_reset = false
        this.upload.loading = false
        this.upload.loadingTitle = 'Uploading...(0%)'
        if (this.props.initialValue) {
            this.upload.need_upload = false
        }
        this.inputId = randomString(10, { onlyChars: true })
        this.uploadURL = this.props.uploadUrl
        this.masterId = this.props.masterId
        this.tempId = this.props.tempId
    },
    onBeforeMount() {
        this.init()
    },
    onBeforeUnmount() {
        cancelAllRequest()
        if (this.checkStatus) {
            clearInterval(this.checkStatus)
        }
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
        if (this.tempId && !this.upload.processDone) this.getStatus(this.tempId)
        // this.checkStatus = setInterval(() => {
        //     console.log(this.upload.loading, this.tempId, !this.upload.processDone)
        //     if (this.upload.loading) {
        //         if (this.tempId && !this.upload.processDone) {
        //             console.log('cek status...')
        //             this.getStatus(this.tempId)
        //         }
        //     }
        // }, 10 * 1000)
    },
    onBeforeUpdate(props) {
        this.uploadURL = props.uploadUrl
        this.masterId = props.masterId
        this.tempId = props.tempId
    },
    callback(data) {
        this.props.callback(data)
    },
    doChange(e) {
        if (result(e, 'target.files[0]') !== this.fileOld) {
            this.upload.upload_success = false
            this.upload.upload_fail = false
            this.upload.need_upload = true
            this.upload.processDone = false
            this.upload.title = 'Upload'
            this.update()
        }
    },
    doUpload() {
        if (this.upload.title !== 'Upload') return false
        debugLog('upload in progress')
        const el = this.$('#' + this.inputId)
        const file = el.files[0]
        this.fileOld = file
        if (file) {
            this.uploadWithAxios(file)
        } else {
            showAlertError(new Error('Please Select File'))
        }
    },
    uploadWithAxios(fileData) {
        axios.defaults.onUploadProgress = (progressEvent) => {
            if (this.upload.loading) {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                this.upload.processDone = false
                this.upload.upload_success = false
                this.upload.loading  = true
                this.upload.loadingTitle = `Uploading...(${percentage}%)`
                this.update()
            }
        }
        let formData = new FormData()
        formData.append('push_notif_master_id', '')
        formData.append('file', fileData)
        this.upload.loading = true
        this.update()
        axios.post(this.uploadURL, formData)
            .then(response => {
                this.callback({response: response.data, success: true})
                this.upload.upload_success = true
                this.upload.upload_fail = false
                this.upload.need_upload = false
                this.upload.is_reset = true
                this.upload.loadingTitle = `Getting Status`
                this.update()
                this.tempId = response.data.tempId
                setTimeout(() => {
                    this.getStatus(this.tempId)
                }, 3 * 1000)
            })
            .catch(err => {
                showAlertError(err)
                this.callback({success: false})
                this.upload.upload_success = false
                this.upload.upload_fail = true
                this.upload.need_upload = true
                this.upload.is_reset = true
                this.upload.loading = false
                this.upload.is_processing = false
                this.upload.title = 'Upload'
                this.update()
            })
    },
    getStatus(tempId) {
        console.log('getting status', tempId)
        if (!tempId) {
            console.log('No Temp Id')
            return false
        }
        this.upload.loadingTitle = 'Waiting...'
        this.upload.loading = true
        this.update()
        pushNotifGetTargetUserStatus({
            tempId
        })
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then((res) => {
                if (res) {
                    this.upload.is_processing = true
                    this.upload.loadingTitle = 'Processing...'
                    const status = (res.status.toLowerCase() === 'finished')
                    if (status) {
                        console.log('processing target user(done)')
                        this.upload.processDone = true
                        this.upload.upload_success = true
                        this.upload.is_processing = false
                        this.upload.loading = false
                        this.upload.title = 'Done'
                        this.upload.loadingTitle = ''
                    } else {
                        setTimeout(() => {
                            this.getStatus(tempId)
                        }, 5 * 1000)
                    }
                    this.update()
                    this.callback({ status: res.status.toLowerCase() })
                }
            })
    },
}