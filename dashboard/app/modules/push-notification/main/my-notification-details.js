import {
    cancelAllRequest,
} from 'services/SDK/main'
import Cron from 'helpers/cron'
import { result } from 'lodash'
import { randomString } from 'helpers/utilities'
import { goTo } from 'helpers/ma'
import { getStorage, changeStorage } from 'helpers/storage'

export default {
    onBeforeMount() {
        this.cron = new Cron()
        const data = getStorage('DETAIL', 'NOTIFICATION')
        this.contentId = randomString(10, {onlyChars: true})
        this.preview = {}
        if (data) {
            const item = JSON.parse(data)
            this.actions = item.actions
            this.goBackURL = item.goBackURL
            this.preview = {
                notificationId: result(item, 'notificationId', '-'),
                notificationTitle: result(item, 'title', '-'),
                shortDesc: result(item, 'shortDesc', '-'),
                body: result(item, 'body', '-'),
                imageUrl: result(item, 'imageUrl'),
                url: result(item, 'bodyWebviewUrl', '-'),
                urlText: result(item, 'bodyWebviewText', '-'),
                destinationPage: result(item, 'screenRedirection', '-'),
                downloadTargetUserURL: result(item, 'downloadTargetUserURL'),
                targetedUsersURL: result(item, 'targetLink', '-'),
                bodyWebviewText: result(item, 'bodyWebviewText', '-'),
                bodyWebviewUrl: result(item, 'bodyWebviewUrl', '-'),
                messageCategory: result(item, 'messageCategory', '-'),
                status: result(item, 'status', '-'),
                schedule: {
                    cron: result(item, 'schedule.cron', '-'),
                    type: result(item, 'schedule.type', '-'),
                    startDate: result(item, 'schedule.startDateFormatted', '-'),
                    endDate: result(item, 'schedule.endDateFormatted', '-'),
                    day: result(item, 'schedule.day', '-'),
                    date: result(item, 'schedule.date', '-'),
                    time: result(item, 'schedule.time', '-'),
                    id: result(item, 'schedule.id', '-'),
                },
                thumbnail: './notification-assets/200x200.png'
            }
            changeStorage({
                DATA_EDIT: JSON.stringify(item)
            }, 'NOTIFICATION')
        }
        this.sendTest = {
            list: {},
            disabled: false
        }
        this.modalTargetUsers = {
            show: false,
            tempId: this.preview.targetedUsersURL
        }
    },
    onMounted() {
        this.preview.bodyText = this.$('#' + this.contentId).textContent
        this.update()
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
    backToList() {
        goTo(this.goBackURL)
    },
    callbackFCMToken(res) {
        if (res.isChecked) this.sendTest.list[res.key] = res.item
        else delete this.sendTest.list[res.key]
        this.update()
    },
    doEdit(e) {
        e.preventDefault()
        goTo('notification/edit')
    },
    showModalTargetUsers() {
        this.modalTargetUsers.show = true
        this.update()
    },
    hideModalTargetUsers() {
        this.modalTargetUsers.show = false
        this.update()
    },
    downloadTargetUsers() {
        window.open(this.preview.downloadTargetUserURL)
    },
}