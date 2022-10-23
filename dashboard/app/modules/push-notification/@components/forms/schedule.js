// import {
//     cancelAllRequest,
// } from 'services/SDK/main'
// import {
//     pushNotifCode,
// } from 'appModule/push-notification/push-notification.sdk'
import Cron from 'helpers/cron'
import { result } from 'lodash'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'
const monthList = [
    { name: 'january', title: 'January' },
    { name: 'february', title: 'February' },
    { name: 'march', title: 'March' },
    { name: 'april', title: 'April' },
    { name: 'may', title: 'May' },
    { name: 'june', title: 'June' },
    { name: 'july', title: 'July' },
    { name: 'august', title: 'August' },
    { name: 'september', title: 'September' },
    { name: 'october', title: 'October' },
    { name: 'november', title: 'November' },
    { name: 'december', title: 'December' },
]
const dayList = [
    {name: 'SUN', title: 'SUN'},
    {name: 'MON', title: 'MON'},
    {name: 'TUE', title: 'TUE'},
    {name: 'WED', title: 'WED'},
    {name: 'THU', title: 'THU'},
    {name: 'FRI', title: 'FRI'},
    {name: 'SAT', title: 'SAT'},
]

export default {
    onBeforeMount(props) {
        if (typeof this.props.callback !== 'function') return showAlertError(new Error('[Schedule Recurring] Callback Required'))
        this.cron = new Cron()
        this.ids = {
            timeId: randomString(10, {onlyChars: true}),
        }
        this.callbackData = {
            type: props.elType,
            month: null,
            day: null,
            dayOfMonth: null,
            date: moment().format('YYYY-MM-DD'),
            time: '08:00'
        }
        this.dateList = []
        for (let i = 1; i <= 31; i++) {
            let title = `${i}`
            if (i < 10) title = `0${i}`
            this.dateList.push({name: i, title})
        }
        this.monthList = monthList
        this.dayList = dayList
        if (props.elData) {
            this.callbackData = props.elData
            const time = result(this.callbackData, 'time')
            if (time) {
                this.callbackData.timeNonUTC = time // jika ini diubah spt yg bawah maka di detail juga harus di ubah
                // this.callbackData.timeNonUTC = this.cron.getTimeNonUTC(time)
            }
        } else {
            if (props.elType === 'ONE_TIME_NOTIFICATION') this.callbackData.date = moment().format('YYYY-MM-DD')
            else {
                this.callbackData.startDate = moment().format('YYYY-MM-DD 08:00')
                this.callbackData.endDate = moment().format('YYYY-MM-DD 18:00')
            }
        }
        if (props.elType) this.callbackData.type = props.elType
    },
    onMounted() {
        debugLog(`[${this.name}] [MOUNTED]`)
        this.resetStartEndDate()
    },
    onBeforeUpdate(props) {
        // if (props.elType !== this.callbackData.type) this.resetStartEndDate()
        if (props.elType) this.callbackData.type = props.elType
        if (props.elData) {
            this.callbackData = props.elData
        } else {
            if (props.elType === 'ONE_TIME_NOTIFICATION') this.callbackData.date = moment().format('YYYY-MM-DD')
            else {
                if(!this.callbackData.startDate || !this.callbackData.endDate) {
                    this.callbackData.startDate = moment().format('YYYY-MM-DD 08:00')
                    this.callbackData.endDate = moment().format('YYYY-MM-DD 18:00')
                }
            }
        }
    },
    // callback
    callback() {
        const cron = this.cron.setConfig(this.callbackData).translate()
        this.callbackData.cron = cron
        this.props.callback(this.callbackData)
    },
    resetDateTime() {
        this.callbackData.time = moment().format('08:00')
        this.callback()
    },
    callbackDropdownMonth(res) {
        this.callbackData.month = res.value
        this.callback()
    },
    callbackCheckboxGroup(res) {
        this.callbackData.day = res.map(x => x.toUpperCase())
        this.callback()
    },
    callbackInputAt(e) {
        let value = e.target.value
        const nValue = parseInt(value.replace(':', ''))
        if (nValue < 800 || nValue > 1800) { // 08:00 - 18:00
            showAlertError(new Error('Invalid Time Value'))
            e.target.value = '08:00'
            value = '08:00'
        }
        value = moment().format('YYYY-MM-DD ') + value
        this.callbackData.time = moment(value).format('HH:mm')
        // this.callbackData.timeNonUTC = moment(value).format('HH:mm')
        // this.callbackData.time = moment(value).utc().format('HH:mm')
        this.callbackData.timeUTC = moment(value).utc().format('HH:mm')
        this.callback()
    },
    callbackDropdownDayOfMonth(res) {
        this.callbackData.dayOfMonth = res.value // date
        this.callback()
    },
    callbackDate(type, res) {
        let f = 'YYYY-MM-DD'
        if (type && res.date) {
            if (['startDate', 'endDate'].indexOf(type) > -1){
                if (type === 'startDate') f += ' 08:00'
                else f += ' 18:00'
                this.callbackData[type] = new Date(res.date.format(f)).toISOString()
            } else {
                this.callbackData[type] = res.date.format(f)
            }
            this.callback()
        }
    },
    resetStartEndDate() {
        this.callbackData.startDate = moment().set({h: 8, m: 0, s: 0}).toISOString() // .format('YYYY-MM-DD HH:mm')
        this.callbackData.endDate = moment().set({h: 18, m: 0, s: 0}).toISOString() // .format('YYYY-MM-DD HH:mm')
        this.callbackData.date = moment().format('YYYY-MM-DD')
    },
}