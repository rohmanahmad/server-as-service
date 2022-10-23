import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    sendTestMessage,
    createNotif,
    updateNotification,
    submitForApproval,
    pushNotifUploadConfig
} from 'appModule/push-notification/push-notification.sdk'
import { getCookie } from 'helpers/cookie'
import { randomString, showAlertSuccess, showAlertError, logInfo } from 'helpers/utilities'
import { goTo } from 'helpers/ma'
import { result } from 'lodash'
import { getStorage, deleteStorage } from 'helpers/storage'
import { newNotificationValidation, updateNotificationValidation, sendTestMessageValidation } from 'helpers/validation'

export default {
    init() {
        this.buttons = {
            sendTest: {
                disabled: false,
                loading: false
            },
            waiting_for_approval: {
                disabled: true,
                loading: false
            },
            save_as_draft: {
                disabled: false,
                loading: false
            },
            update_changes: {
                disabled: false,
                loading: false
            }
        }
        this.uploadTargetUsers = {isSuccessUploaded: false, isFailUploaded: false}
        let initialData = getStorage('DATA_EDIT', 'NOTIFICATION')
        let scheduleType = ''
        if (initialData) {
            this.isEditMode = true
            initialData = JSON.parse(initialData)
            scheduleType = result(initialData, 'schedule.type')
            this.isValidSchedule = true
        }
        this.forms = {
            notificationId: { value: 0, items: [], inc: 0 }, // id tergenerate di component otomatis
            notificationTitle: { value: result(initialData, 'title', 'My Title Example'), id: randomString(10, {onlyChars: true}) },
            notificationDesc: { id: randomString(10, {onlyChars: true}), value: result(initialData, 'shortDesc', 'My Description') },
            notificationContent: { value: result(initialData, 'body', 'Content Here') },
            uploadedImage: { value: result(initialData, 'image_url', ''), id: randomString(10, {onlyChars: true}) },
            url: { value: result(initialData, 'bodyWebviewUrl', ''), id: randomString(10, {onlyChars: true}) },
            viewURL: { value: result(initialData, 'bodyWebviewText', ''), id: randomString(10, {onlyChars: true}) },
            destinationPage: { value: result(initialData, 'screenRedirection', 'HOME_SCREEN'), id: randomString(10, {onlyChars: true}), items: [] },
            scheduleType: { value: scheduleType, id: randomString(10, {onlyChars: true}), items: [
                {name: 'ONE_TIME_NOTIFICATION', title: 'One Time Notification'},
                {name: 'DAILY', title: 'Daily'},
                {name: 'WEEKLY', title: 'Weekly'},
                {name: 'MONTHLY', title: 'Monthly'},
            ] },
            // scheduleStartDate: { value: result(initialData, 'schedule.startDate', ''), id: randomString(10, {onlyChars: true}) },
            // scheduleEndDate: { value: result(initialData, 'schedule.endDate', ''), id: randomString(10, {onlyChars: true}) },
            fcmTokens: { refresh: false },
        }
        this.masterId = result(initialData, 'id', null),
        this.callbackData = {
            body: result(initialData, 'body', this.forms.notificationContent.value), // String
            bodyWebviewText: result(initialData, 'bodyWebviewText', null), // String
            bodyWebviewUrl: result(initialData, 'bodyWebviewUrl', null), // String
            // createdAt: null, // String diatur di backend
            // createdBy: null, // String diatur di backend
            expiryPeriodInSecond: result(initialData, 'expiryPeriodInSecond', 0), // Number
            imageUrl: result(initialData, 'imageUrl', null), // String
            inbox: result(initialData, 'inbox', true), // Boolean
            messageCategory: result(initialData, 'messageCategory', 'AD_HOC'), // String
            notificationId: result(initialData, 'notificationId', null), // String
            notificationCode: result(initialData, 'notificationCode', null), // String
            notificationType: result(initialData, 'notificationType', 'push'), // String
            schedule: {
                cron: result(initialData, 'schedule.cron', null), // String
                startDate: result(initialData, 'schedule.startDate', null), // String
                startDateFormatted: result(initialData, 'schedule.startDateFormatted', null), // String
                endDate: result(initialData, 'schedule.endDate', null), // String
                endDateFormatted: result(initialData, 'schedule.endDateFormatted', null), // String
                date: result(initialData, 'schedule.date', null), // String
                time: result(initialData, 'schedule.time', null), // String
                day: result(initialData, 'schedule.day', null), // String
                type: result(initialData, 'schedule.type', null), // String
            },
            screenRedirection: result(initialData, 'screenRedirection', 'HOME_SCREEN'), // String
            shortDesc: result(initialData, 'shortDesc', ''), // String
            status: result(initialData, 'status', null), // String
            targetLink: result(initialData, 'targetLink', null), // String
            tempId: result(initialData, 'tempId', null), // String
            title: this.forms.notificationTitle.value, // String
        }
        if (!this.callbackData.screenRedirection) this.callbackData.screenRedirection = 'HOME_SCREEN'
        this.preview = {
            thumbnail: './notification-assets/200x200.png'
        }
        this.modals = {
            addFCMToken: {
                show: false
            }
        }
        this.sendTest = {
            list: {},
            disabled: false
        }
        this.fcmToken = { refresh: false }
        this.isScheduled = false
        this.uploadImage = { value: this.callbackData.imageUrl }
        this.uploadConfig = {}
    },
    onBeforeMount() {
        this.init()
    },
    onMounted() {
        this.getUploadConfig()
        this.validateRequiredFields()
    },
    onBeforeUnmount() {
        cancelAllRequest()
        deleteStorage('NOTIFICATION_DATA_EDIT')
    },
    getUploadConfig() {
        pushNotifUploadConfig()
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                this.uploadConfig = res.data
                this.update()
            })
    },
    // events
    showModalAddFCMToken() {
        this.modals.addFCMToken.show = true
        this.update()
    },
    callbackModalAddFCMToken(res) {
        const { success, hide, refresh } = res || {}
        this.modals.addFCMToken.show = false
        this.fcmToken.refresh = refresh
        this.update()
    },
    callbackFCMToken(res) {
        this.fcmToken.refresh = res.refresh
        if (res.isChecked) this.sendTest.list[res.key] = res.item
        else delete this.sendTest.list[res.key]
        this.update()
    },
    // callbacks
    callbackUploadImage(res) {
        const { id, fileData, response } = res || {}
        if (response && response.data) {
            const fileUrl = response.data
            this.callbackData.imageUrl = fileUrl
            this.previewUploadImage({ fileUrl })
        }
    },
    previewUploadImage({ fileData, fileUrl }) {
        this.preview.changed = true
        if (fileData) {
            this.preview.thumbnail = `data:${fileData.fileType};base64,${fileData.base64}`
        } else if (fileUrl) {
            this.preview.thumbnail = fileUrl
        }
        this.update()
    },
    updateTitle() {
        const c = this.forms.notificationTitle
        let value = this.$('#' + c.id).value
        this.forms.notificationTitle.value = value
        this.update()
        this.callbackData.title = value
        this.validateRequiredFields()
    },
    updateContent(data){
        this.forms.notificationContent.value = data.text
        this.previewHTML = ''
        this.update()
        this.callbackData.body = data.value
        this.validateRequiredFields()
    },
    notificationIdCallback({ inc=0, title }) {
        this.forms.notificationId.inc = inc // untuk update value counter
        this.callbackData.notificationCode = title
        this.update()
        this.callbackData.notificationId = [title, inc].join('')
        this.validateRequiredFields()
    },
    destinationPageCallback(data) {
        this.callbackData.screenRedirection = data.name
    },
    scheduleTypeCallback(data) {
        const value = data.value
        this.forms.scheduleType.value = value
        this.callbackData.schedule.cron = ''
        // this.validateRequiredFields()
        this.update()
    },
    /* uploadTargetUserCallbackServer(res) {
        const { success, response } = res || {}
        if (success) this.uploadTargetUsers.isSuccessUploaded = success
        else this.uploadTargetUsers.isFailUploaded = !success
        // this.uploadTargetUsers.response = response.data
        this.update()
        // this.callbackData.targetLink = result(response, 'data.file_url', '')
        this.callbackData.targetLink = result(response, 'data.temp_id', '')
    }, */
    uploadTargetUserCallbackClient(res) {
        const { success, response, status } = res || {}
        if (success) this.uploadTargetUsers.isSuccessUploaded = success
        else this.uploadTargetUsers.isFailUploaded = !success
        // check progress data processing
        if (status === 'finished') this.validateRequiredFields()
        // this.uploadTargetUsers.response = response
        // this.update()
        // this.callbackData.targetLink = result(response, 'data.file_url', '')
        if (response) {
            this.callbackData.targetLink = result(response, 'tempId', '')
            this.callbackData.tempId = result(response, 'tempId', '')
        }
    },
    callbackSchedule(data) {
        this.isValidSchedule = false
        for (const d in data) {
            if (!data[d]) continue
            if (d === 'day') {
                if (data[d].join) data[d] = data[d].join(',')
            }
            this.callbackData.schedule[d] = data[d]
            if (d === 'cron') {
                this.isValidSchedule = true
                this.update()
            }
        }
        this.validateRequiredFields()
    },
    getOtherValues() {
        this.callbackData.shortDesc = this.$('#' + this.forms.notificationDesc.id).value
        // this.callbackData.imageUrl = 'NOT_SET' // blm dibuatkan function untuk upload
        this.callbackData.bodyWebviewUrl = this.$('#' + this.forms.url.id).value
        this.callbackData.bodyWebviewText = this.$('#' + this.forms.viewURL.id).value
        if (this.callbackData.title.length > 255) throw new Error('Notification Title Max 255 Characters')
        if (this.callbackData.shortDesc.length > 255) throw new Error('Notification Short Description Max 255 Characters')
    },
    // button events
    async saveNotification(e, status) {
        try {
            if (e && e.preventDefault) e.preventDefault()
            let update = null
            let action = 'Submitted'
            this.callbackData.status = status === 'UPDATE' ? this.callbackData.status : status
            this.getOtherValues()
            if (this.isEditMode) {
                action = 'Updated'
                updateNotificationValidation(this.callbackData)
                if (!this.isValidSchedule) throw new Error('Schedule Not Valid')
                this.buttons.update_changes.loading = true
                this.update()
                update = updateNotification(this.masterId, this.callbackData)
            } else {
                newNotificationValidation(this.callbackData)
                if (status === 'IN_PROGRESS' || status === 'WAITING_FOR_APPROVAL') {
                    this.buttons.waiting_for_approval.loading = true
                    this.update()
                    update = submitForApproval(this.callbackData)
                } else {
                    if (!this.isValidSchedule) throw new Error('Schedule Not Valid')
                    this.buttons.save_as_draft.loading = true
                    this.update()
                    update = createNotif(this.callbackData)
                }
            }
            if (update) {
                const res = await update
                if (!res) return null
                showAlertSuccess('Notification '+ action +' as ' + this.callbackData.status)
                goTo('notification/my-list')
            }
        } catch (err) {
            debugger
            if (err) showAlertError(err)
            this.buttons.update_changes.loading = false
            this.buttons.waiting_for_approval.loading = false
            this.buttons.save_as_draft.loading = false
            this.validateRequiredFields()
        }
    },
    removeUploadImageCb() {
        this.preview.thumbnail = './notification-assets/200x200.png'
        this.callbackData.imageUrl = ''
        this.update()
    },
    // utilities
    testDownloadUploadedUsers() {
        const urlFile = result(this.uploadTargetUsers, 'response.file_url', this.callbackData.targetLink)
        window.open(urlFile)
    },
    sendTestMessage() {
        try {
            this.buttons.sendTest.disabled = true
            this.buttons.sendTest.loading = true
            this.update()
            this.getOtherValues()
            const listSelected = result(this.sendTest, 'list', {})
            const deviceDestination = Object.keys(listSelected)
                .map(x => ({
                    userName: result(listSelected, `${x}.username`),
                    email: result(listSelected, `${x}.email`)
                }))
            sendTestMessageValidation(this.callbackData)
            const data = {
                operationId: randomString(20), // TBD
                owner: getCookie('userid').replace('@', ''), // user maker
                type: 'SEND_NOTIFICATION', // static
                timestamp: new Date(),
                payload: {
                    // internalMessageId: this.callbackData.notificationId, // auto dari mas heri
                    notificationType: 'push', // default dari mas heri
                    to: deviceDestination,
                    inbox: true,
                    data: {
                        title: this.callbackData.title,
                        shortDesc: this.callbackData.shortDesc,
                        body: this.callbackData.body,
                        imageUrl: this.callbackData.imageUrl,
                        expiryPeriodInSecond: 0,
                        messageCategory: this.callbackData.messageCategory,
                        bodyWebviewUrl: this.callbackData.bodyWebviewUrl,
                        bodyWebviewText: this.callbackData.bodyWebviewText,
                        customData: [
                            { value: this.callbackData.screenRedirection, key: 'screenRedirection' }
                        ]
                    },
                }
            }
            sendTestMessage(data)
                .catch(err => {
                    showAlertError(err)
                    return null
                })
                .then(res => {
                    this.buttons.sendTest.disabled = false
                    this.buttons.sendTest.loading = false
                    this.update()
                    if (!res) return null
                    showAlertSuccess()
                })
        } catch (err) {
            showAlertError(err)
        }
    },
    updatePreview(e) {
        const v = e.target.value
        const l = v.length
        const max = 40
        if (l > max) this.isContentOverflow = true
        else this.isContentOverflow = false
        this.forms.notificationDesc.value = v
        this.update()
    },
    validateRequiredFields() {
        logInfo('validating required fields')
        try {
            const notificationId = this.callbackData.notificationId
            if (!notificationId) throw new Error('Invalid Notification Id')
            const notificationTitle = this.callbackData.title
            if (!notificationTitle) throw new Error('Notification Title Required')
            const shortDesc = this.$('#' + this.forms.notificationDesc.id).value
            if (!shortDesc) throw new Error('Short Description Required')
            const detail = this.callbackData.body
            if (!detail) throw new Error('Notification Detail Required')
            const targetUsers = this.callbackData.targetLink
            if (!targetUsers) throw new Error('Target Users Required')
            const schedule = this.callbackData.schedule.cron
            if (!schedule) throw new Error('Invalid Schedule')
            this.buttons.waiting_for_approval.disabled = false
            this.buttons.save_as_draft.disabled = false
            this.buttons.update_changes.disabled = false
        } catch (err) {
            console.log(err)
            this.buttons.waiting_for_approval.disabled = true
            this.buttons.save_as_draft.disabled = true
            this.buttons.update_changes.disabled = true
        }
        this.update()
    }
}
