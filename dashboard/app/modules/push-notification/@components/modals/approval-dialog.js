import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    createPushNotifComments,
    pushNotifGetChangesMaster,
    approveRejectNotification,
} from 'appModule/push-notification/push-notification.sdk'
import { result } from 'lodash'
import { showAlertError, showAlertSuccess, randomString, debugLog } from 'helpers/utilities'
import { goTo } from 'helpers/ma'
import { changeStorage } from 'helpers/storage'
import { rejectedPushNotificationValidation, approvedPushNotificationValidation } from 'helpers/validation'

export default {
    init() {
        this.buttonId = randomString(10, {onlyChars: true})
        this.inputText1Id = randomString(10, {onlyChars: true})
        this.modalId = randomString(10, {onlyChars: true})
        this.callbackData = { uploaded: false, isUpload: false, file_url: '', refresh: false }
        this.isprocessing = false
        this.modalEnabled = false
        this.buttons = {
            reject: { loading: false, disabled: false },
            approve: { loading: false, disabled: false },
        }
        this.item = null
    },
    onBeforeMount() {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Modal Add FCM Token] Callback Required'))
        this.init()
    },
    onBeforeUpdate() {
        this.callbackData.isUpload = false
        if (this.props.elData) {
            this.isWaitingForApproval = (result(this.props, 'elData.status', '') === 'WAITING_FOR_APPROVAL')
        }
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    onUpdated(props, local) {
        if (props.showModal && this.modalEnabled !== this.props.showModal && !this.item) {
            this.showModal()
            this.elInputComment = this.$('#'+this.inputText1Id)
            // this.buttons.reject.disabled = false
            // this.buttons.approve.disabled = false
            this.masterId = props.elData.id
            if (!this.masterId) throw new Error('Invalid Master ID')
            this.item = {}
            pushNotifGetChangesMaster({
                master_id: this.masterId
            })
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                if (!res) return null
                this.item = res.data
                this.update()
            })
        }
    },
    showModal() {
        const el = $('#' + this.modalId)
        el.modal('show')
        el.on('hidden.bs.modal', () => {
            this.buttons.reject = { loading: false, disabled: false }
            this.buttons.approve = { loading: false, disabled: false }
            this.modalEnabled = false
            this.callbackData.isUpload = false
            this.callbackData.uploaded = false
            this.callbackData.file_url = ''
            if (this.elInputComment) this.elInputComment.value = ''
            this.item = null
            this.callback(this.callbackData)
        })
    },
    hideModal() {
        const el = $('#' + this.modalId)
        el.modal('hide')
        this.callback()
    },
    callback() {
        this.props.callback(this.callbackData)
    },
    uploadAttachment(data) {
        debugLog(data)
    },
    async sendComment(status) {
        try {
            const body = {
                comment: (this.elInputComment) ? this.elInputComment.value : '',
                imageUpload: this.callbackData.file_url,
                masterId: this.masterId,
                status
            }
            if (status === 'REJECTED') rejectedPushNotificationValidation(body)
            else if (status === 'APPROVED') approvedPushNotificationValidation(body)
            const res = await createPushNotifComments(body)
            let updatedStatus = {status: ''}
            this.buttons.reject.disabled = true
            this.buttons.approve.disabled = true
            if (status === 'REJECTED') {
                updatedStatus['status'] = 'DRAFT'
                this.buttons.reject.loading = true
            } else if (status === 'APPROVED') {
                updatedStatus['status'] = 'IN_PROGRESS'
                this.buttons.approve.loading = true
            }
            this.update()
            const updateItem = { ...this.props.elData, ...updatedStatus }
            await approveRejectNotification(body.masterId, updateItem)
            showAlertSuccess('Notification ' + status)
            this.hideModal()
            this.callbackData.refresh = true
        } catch (err) {
            this.buttons.reject.disabled = false
            this.buttons.approve.disabled = false
            this.buttons.reject.loading = false
            this.buttons.approve.loading = false
            this.update()
            if (result(err, 'error', '').indexOf('504') > -1) {
                showAlertSuccess('Success')
                console.error('Gateway Timeout')
                this.hideModal()
            } else throw err
        }
    },
    async doReject(res) {
        try {
            await this.sendComment('REJECTED')
            if (this.elInputComment) this.elInputComment.value = ''
        } catch (err) {
            showAlertError(err)
        }
    },
    async doApprove(res) {
        try {
            await this.sendComment('APPROVED')
            if (this.elInputComment) this.elInputComment.value = ''
        } catch (err) {
            showAlertError(err)
        }
    },
    uploadCallback(res) {
        const { response, success } = res
        this.callbackData.isUpload = true
        this.callbackData.uploaded = success
        this.callbackData.file_url = response.data
        this.update()
    },
    doSeeDetail() {
        this.hideModal()
        changeStorage({ 'DETAIL': JSON.stringify(this.props.elData) }, 'NOTIFICATION')
        goTo('notification/details')
    },
}