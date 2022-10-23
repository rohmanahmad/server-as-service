import PageComponents from '../@components/pages/index.pages-components'

export default {
    components: {
        ...PageComponents
    },
    onBeforeMount() {},
    onBeforeUnmount() {},
    onMounted() {},
    historyBack(e) {
        if (e && e.preventDefault) e.preventDefault()
        history.back()
    }
}
