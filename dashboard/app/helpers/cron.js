// class Cron {
//     constructor({cronModel= '* * * * * *'}) {
//         this.model = cronModel.split(' ')
//     }

//     translateFromCronModel() {
//         const seconds = this.model[0]
//         const minutes = this.model[1]
//         const hours = this.model[2]
//         const dayofmonth = this.model[3]
//         const month = this.model[4]
//         const dayofweek = this.model[5]
//         const year = this.model[6]
//     }

//     getTranslatedModel(partKey, partValue) {
//         try {
//             // 
//         } catch (err) {
//             throw err
//         }
//     }
// }
import moment from 'moment'

class Cron {
    /* 
    - type [String[scheduled, daily, weekly, monthly]] [example 'daily'] default NULL
    - dayOfMonth [String[1,2,3...31]] [example 1] required for type [monthly]
    - time [String[00:00 - 23:59]] [example: '01:10'] required for [monthly] & [weekly] & [daily]
    - dayOfWeek [String[SUN, MON, ...SAT]] [example 'SUN']
    - years [String] example '2022' [default *]
     */
    constructor (config={}) {
        this.config = config
    }
    setConfig ({type, day, timeUTC: time, date, dayOfMonth}) {
        this.config = {type, day, time, date, dayOfMonth}
        return this
    }
    translate () {
        try {
            let res = ''
            switch (this.config.type) {
                case 'ONE_TIME_NOTIFICATION':
                    res = this.getOneTimeNotification()
                    break
                case 'DAILY':
                    res = this.getDailyFormat()
                    break
                case 'WEEKLY':
                    res = this.getWeeklyFormat()
                    break
                case 'MONTHLY':
                    res = this.getMonthlyFormat()
                    break
            }
            return res.replace(/\s+/g,' ').trim()
        } catch (err) {
            throw err
        }
    }
    getTime () {
        const { time } = this.config
        if (time) {
            const t = time.split(':')
            const h = parseInt(t[0])
            const m = parseInt(t[1])
            const s = parseInt(t[2])
            return { h, m, s: (s > 0 ? s : 0) }
        } else {
            return { h: '?', m: '?', s: '?'}
        }
    }
    getDate(format='YYYY-MMM-DD') {
        let { date } = this.config
        if (!date) date = moment().format('YYYY-MM-DD').toUpperCase()
        date = moment(date).format(format).toUpperCase()
        const dt = date.split('-')
            .map((x, i) => {
                if (format === 'YYYY-MMM-DD' && i !== 1) x = parseInt(x)
                return x
            })
        const Y = dt[0]
        const M = dt[1]
        const D = dt[2]
        return { Y, M, D }
    }
    getOneTimeNotification() {
        const { h, m, s } = this.getTime()
        const { D, M, Y} = this.getDate('YYYY-MMM-DD')
        return `${s} ${m} ${h} ${D} ${M} ${'?'} ${Y}`.trim()
    }
    getDailyFormat () {
        const { h, m, s } = this.getTime()
        return `${s} ${m} ${h} * * ${''} ?`.trim()
    }
    getWeeklyFormat () {
        const { h, m, s } = this.getTime()
        const d = this.config.day
        const days = d.join ? d.join(',') : d
        return `${s} ${m} ${h} ? * ${days} *`
    }
    getMonthlyFormat () {
        const { h, m, s } = this.getTime()
        const date = parseInt(this.config.dayOfMonth)
        return `${s} ${m} ${h} ${date} * ${''} ?`.trim()
    }
    getTimeNonUTC (time) {
        const utcOffset = moment().utcOffset() / 60
        const tArray = time.split(':')
        const h = parseInt(tArray[0])
        const hOffset = h + utcOffset
        if (hOffset < 10) tArray[0] = '0' + hOffset
        else tArray[0] = hOffset
        return tArray.join(':')
    }
}

export default Cron