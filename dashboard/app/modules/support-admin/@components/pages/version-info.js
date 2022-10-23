import {
    cancelAllRequest,
} from 'services/SDK/main'
import {
    versionInfo,
} from 'appModule/support-admin/support-admin.sdk'
const pjson = require('packagejson')
export default {
    onBeforeMount() {
        this.frontendVersion = pjson.app_version
        versionInfo()
            .then(x => {
                this.backendVersion = x.version
                this.update()
            })
    },
    onMounted() {
    },
    onBeforeUnmount() {
        cancelAllRequest()
    },
}