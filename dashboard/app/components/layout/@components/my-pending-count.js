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
        this.totalPending = 0
        this.update()
    },
}