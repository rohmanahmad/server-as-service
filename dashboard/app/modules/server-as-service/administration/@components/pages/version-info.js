import {
    cancelAllRequest
} from 'appsdk'
import {
    versionInfo,
} from '../../config/administration.sdk'
const pjson = require('package')

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