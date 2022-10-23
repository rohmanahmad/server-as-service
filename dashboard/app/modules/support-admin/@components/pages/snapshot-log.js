import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    snapshotStatus,
    snapshotStart,
    snapshotStop,
    snapshotList,
    snapshotDownload,
    snapshotReset,
} from 'appModule/support-admin/snapshots.sdk'
import { result } from 'lodash'
import { showAlertError, showAlertSuccess, debugLog } from 'helpers/utilities'
import downloadFile from 'js-file-download'

export default {
    toggleStatus: 0, // Off / Stopped
    toggleStatuses: ['Stopped', 'Started'],
    onBeforeMount() {},
    onMounted() {
        this.createScheduleStatusCheck()
        this.getList()
    },
    onBeforeUnmount() {
        if (this.schedule) clearInterval(this.schedule)
        cancelAllRequest()
    },
    createScheduleStatusCheck() {
        this.getStatus()
        this.schedule = setInterval(this.getStatus, 10 * 1000)
    },
    toggleStartStop({isChecked, stateValue, stateType, title, titles}) {
        debugLog({isChecked})
        this.toggleStatus = stateValue
        this.update()
        if (isChecked) {
            this.startSnapshot()
        } else {
            this.stopSnapshot()
        }
    },
    toggleCheckAll() {},
    getList() {
        snapshotList({})
            .catch((err) => {
                showAlertError(err)
                return null
            })
            .then((res) => {
                if (res) {
                    const items = result(res, 'data.items', [])
                    this.items = items.map((x, i) => {
                        x.n = 1 + parseInt(i)
                        return x
                    })
                    this.update()
                }
            })
    },
    getStatus() {
        snapshotStatus({})
            .catch((err) => {
                showAlertError(err)
                return null
            })
            .then((res) => {
                if (res) {
                    const snapshotId = result(res, 'data.snapshotId')
                    if (snapshotId) this.toggleStatus = 1
                    else this.toggleStatus = 0
                    this.update()
                }
            })
    },
    startSnapshot(snapshotId) {
        snapshotStart({})
            .catch((err) => {
                showAlertError(err)
                return null
            })
            .then((res) => {
                if (res) {
                    const snapshotId = result(res, 'data.snapshotId')
                    const items = result(res, 'data.items', []).map((x, i) => {
                        x.n = 1 + parseInt(i)
                        return x
                    })
                    this.items = items
                    this.update()
                    this.getList()
                }
            })
    },
    stopSnapshot() {
        snapshotStop({})
            .catch((err) => {
                showAlertError(err)
                return null
            })
            .then((res) => {
                if (res) {
                    const snapshotId = result(res, 'data.snapshotId')
                    const items = result(res, 'data.items', []).map((x, i) => {
                        x.n = 1 + parseInt(i)
                        return x
                    })
                    this.items = items
                    this.update()
                }
            })
    },
    checkSelected() {},
    downloadSnapshot(snapshotId) {
        snapshotDownload({snapshot_id: snapshotId})
            .catch((err) => {
                showAlertError(err)
                return null
            })
            .then((res) => {
                if (res) downloadFile(res, snapshotId + '.csv')
            })
    },
    resetSnapshot() {
        snapshotReset()
            .catch(err => {
                showAlertError(err)
                return null
            })
            .then(res => {
                showAlertSuccess('Snapshot Reset Successfully')
                this.getList()
            })
    }
}