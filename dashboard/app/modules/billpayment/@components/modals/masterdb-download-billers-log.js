import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    masterdbDownloadHistory,
    getBillerProviders
} from 'appModule/billpayment/billpayment.sdk'
import downloadFile from 'js-file-download'
import { showAlertError, randomString, debugLog } from 'helpers/utilities'

export default {
    onBeforeMount(props){
        this.modal = {}
        this.modal.id = randomString(10, {onlyChars: true})
        this.itemGroup = []
        this.getBillerProviders()
        this.query = {processedOn: moment().format('YYYY-MM-DD')}
    },
    onMounted(props) {
        debugLog(`[${this.name}] [MOUNTED]`)
    },
    resetForm() {
    },
    onUpdated(props){
    },
    onBeforeUpdate(props) {
        if (props.showModal && this.modalEnabled !== props.showModal) {
            this.showModal()
        }
    },
    showModal() {
        const el = $('#' + this.modal.id)
        if (el) {
            this.modalEnabled = true
            el.modal('show')
            el.on('hidden.bs.modal', () => {
                this.hideModal()
            })
            this.resetForm()
        }
    },
    toggleCheckAllBillers(e) {
        if ($(e.target).is(':checked')) {
            this.useAllBillers = true
        } else {
            this.useAllBillers = false
        }
        this.update()
    },
    hideModal() {
        this.modalEnabled = false
        this.callback()
        cancelAllRequest()
    },
    callback() {
        this.props.callback()
    },
    getBillerProviders() {
        getBillerProviders({})
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                const billers = res.data
                let i = 1
                this.itemGroup = []
                let childs = []
                for (const b of billers) {
                    childs.push(b)
                    if (i % 3 === 0) {
                        this.itemGroup.push({
                            name: 'group_'+ i,
                            childs
                        })
                        childs = []
                    }
                    i += 1
                }
                this.update()
            })
    },
    getSelectedBillers() {
        const selectors = $('input[type="checkbox"]')
        let data = []
        for (const s of selectors) {
            const sel = $(s)
            const value = s.value
            const isChecked = sel.is(':checked')
            if (isChecked) {
                data.push(value)
            }
        }
        return data
    },
    updateDate(res) {
        this.query['processedOn'] = res.since.format('YYYY-MM-DD')
    },
    downloadSelected() {
        const billers = this.useAllBillers ? ['ALL'] : this.getSelectedBillers()
        masterdbDownloadHistory({ billers: billers.join(), filename: true })
            .catch(err => {
                throw err
            })
            .then(filename => {
                masterdbDownloadHistory({ billers: billers.join(), ...this.query })
                    .catch(err => {
                        throw err
                    })
                    .then(data => {
                        downloadFile(data, filename)
                    })
            })
    },
}