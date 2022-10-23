import { PendingCount } from 'appModule/pending-tasks/pending-tasks.sdk'

export default {
    onBeforeMount() {
        this.totalPending = 0
    },
    onMounted() {
        this.timer = setInterval(() => {
            this.getTotal()
        }, 10 * 1000)
    },
    onBeforeUnmount() {
        if (this.timer) clearInterval(this.timer)
    },
    getTotal() {
        PendingCount()
            .then((response)=>{
                this.totalPending = response.total ? response.total : 0;
                this.update()
            })
            .catch(function (err) {
                console.error(err)
            })
    },
}