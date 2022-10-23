const ranges = {
    // 'All Time': ['All Time'],
    'Today': [moment().set({h: 0, m: 0}), moment().set({h: 23, m: 59})],
    'Yesterday': [moment().subtract(1, 'days').set({h: 0, m: 0}), moment().subtract(1, 'days').set({h: 23, m: 59})],
    'Last 7 Days': [moment().subtract(6, 'days').set({h: 0, m: 0}), moment().set({h: 23, m: 59})],
    'Last 30 Days': [moment().subtract(29, 'days').set({h: 0, m: 0}), moment().set({h: 23, m: 59})],
    'This Month': [moment().startOf('month').set({h: 0, m: 0}), moment().endOf('month').set({h: 23, m: 59})],
    'Last Month': [moment().subtract(1, 'month').startOf('month').set({h: 0, m: 0}), moment().subtract(1, 'month').endOf('month').set({h: 23, m: 59})]
}
const locale = {
    format: 'YYYY/MM/DD HH:mm'
}
// single picker
export const DatePicker = function (selector, options={}, onchanged) {
    $(selector).daterangepicker(options, (start, end) => onchanged(start, end))
}
export const DateTimePicker = function (selector, options={}, onchanged) {
    $(selector).daterangepicker(options, (start, end) => onchanged(start, end))
}
// range picker
export const DateRangePicker = function (selector, options={}, onchanged) {
    $(selector).daterangepicker(options, (start, end) => onchanged(start, end))
}
export const DateTimeRangePicker = function (selector, options={}, onchanged) {
    options.timePicker = true
    options.startDate = moment().startOf('date')
    options.endDate = moment()
    options.ranges = ranges
    options.locale = locale
    options.showDropdown = true
    $(selector).daterangepicker(options, (start, end) => onchanged(start, end))
}